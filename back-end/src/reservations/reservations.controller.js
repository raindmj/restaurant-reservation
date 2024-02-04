const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/*
 * Validation middleware
 */

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
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

// define the valid properties of reservations in an array
const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

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

// checks whether or not the request body includes required fields
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

/* function todaysDate() {
  const date = new Date();

  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });

  const formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}

console.log(todaysDate()); */

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  try {
    const { date, mobile_number } = req.query;
    console.log(date);
    console.log(mobile_number);
    // list by date
    if (date) {
      const data = await service.listByDate(date);
      res.json({ data });
      // list by mobile number
    } else if (mobile_number) {
      const data = await service.search(mobile_number);
      res.json({ data });
      // TODO: list by today's date? or list all?
    } else {
      const data = await service.list();
      res.json({ data });
    }
  } catch (error) {
    next(error);
  }
}

/*
 * Create a new reservation
 */

async function create(req, res, next) {
  try {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

/*
 * Read a reservation given reservation_id
 */

function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
};
