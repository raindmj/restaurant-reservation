const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsService = require("../reservations/reservations.service");

/*
 * Validation middleware
 */

// check if table with table_id exists
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({
      status: 404,
      message: `Table with id ${table_id} does not exist.`,
    });
  }
}

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

// checks whether the request body contains a specified set of allowed fields from the given valid properties array
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// check whether table has:
// 1. table_name that is at least 2 characters long
// 2. capacity of at least 1 person
function isValidTable(req, res, next) {
  const { table_name, capacity } = req.body.data;

  if (table_name.length < 2) {
    next({
      status: 400,
      message: "The table_name field must be at least 2 characters long.",
    });
  }

  if (!Number.isInteger(capacity)) {
    next({
      status: 400,
      message: "The capacity field must be a number.",
    });
  }

  if (capacity < 1) {
    next({
      status: 400,
      message: "The capacity must be at least 1 person.",
    });
  }

  next();
}

// check if reservation exists and read reservation given reservation_id
// use the found reservation to update table reservation_id
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    next({
      status: 404,
      message: `Reservation with id ${reservation_id} does not exist.`,
    });
  }
}

// check if:
// 1. capacity of table will fit people in reservation
// 2. reservation id exists for that table, if it does then it's occupied
// 3. reservation id is already seated at a table
function canMakeReservationAtTable(req, res, next) {
  const { capacity, table_id, reservation_id, table_name } = res.locals.table;
  const { people, status } = res.locals.reservation;

  if (capacity < people) {
    next({
      status: 400,
      message: `Table "${table_name}" does not have sufficient capacity for the amount of people in the reservation.`,
    });
  }

  if (reservation_id) {
    next({
      status: 400,
      message: `Table ${table_id} is occupied.`,
    });
  }

  if (status === "seated") {
    next({
      status: 400,
      message: `Reservation id ${reservation_id} is already seated at table ${table_id}.`,
    });
  }

  next();
}

function tableIsNotOccupied(req, res, next) {
  const { reservation_id, table_id } = res.locals.table;

  if (!reservation_id) {
    next({
      status: 400,
      message: `Table ${table_id} is not occupied.`,
    });
  }

  next();
}

// get the reservation of the reservation id that is assigned to the table
async function readReservationBeforeRemovingIdFromTable(req, res, next) {
  const { reservation_id } = res.locals.table;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    next({
      status: 404,
      message: `Reservation with id ${reservation_id} does not exist.`,
    });
  }
}

/* ---- CRUD ---- */

/**
 * List handler for table resources
 */
async function list(req, res, next) {
  try {
    const data = await tablesService.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

/*
 * Create a new table
 */
async function create(req, res, next) {
  try {
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

/*
 * Get info on one table given table id
 */

function read(req, res, next) {
  const data = res.locals.table;
  res.json({ data });
}

async function update(req, res, next) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;

  const updatedTable = {
    reservation_id,
    table_id,
  };

  const updatedReservation = {
    status: "seated",
    reservation_id,
  };

  try {
    const data = await tablesService.update(updatedTable, updatedReservation);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function destroy(req, res, next) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;

  const updatedTable = {
    reservation_id: null,
    table_id,
  };

  const updatedReservation = {
    status: "finished",
    reservation_id,
  };

  try {
    const data = await tablesService.update(updatedTable, updatedReservation);

    // const data = await tablesService.list();

    res.json({ data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties("table_name", "capacity"),
    hasOnlyValidProperties,
    isValidTable,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
  update: [
    asyncErrorBoundary(tableExists),
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    canMakeReservationAtTable,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableIsNotOccupied,
    asyncErrorBoundary(readReservationBeforeRemovingIdFromTable),
    asyncErrorBoundary(destroy),
  ],
};
