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

// check if inputted people is number and is greater than 0
function hasValidPeople(req, res, next) {
  const { people } = req.body.data;
  if (!Number.isInteger(people)) {
    next({
      status: 400,
      message: `The people field must be a number.`,
    });
  }

  if (people < 1) {
    next({
      status: 400,
      message: `The people field must be greater than 0.`,
    });
  }

  next();
}

// check if inputted reservation_date matches given format
function hasValidReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;

  /* const regex2 =
    /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/; */

  const dateFormatRegex =
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  // check format of date, should be YYYY-MM-DD
  if (!dateFormatRegex.test(reservation_date)) {
    next({
      status: 400,
      message: `The reservation_date of ${reservation_date} is not a valid date.`,
    });
  }

  // check if date is on a Tuesday, restaurant is closed on Tuesdays
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month}, ${day}, ${year}`);
  const dayOfTheWeek = date.getDay();

  if (dayOfTheWeek === 2) {
    next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });
  }

  // check if date is in the past, only future reservations allowed

  next();
}

function hasValidReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;

  // check format of time, should be HH:MM
  const timeFormatRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

  if (!timeFormatRegex.test(reservation_time)) {
    next({
      status: 400,
      message: `The reservation_time of ${reservation_time} is not a valid time.`,
    });
  }

  // check if reservation time is between 10:30 AM and 9:30 PM

  // check if reservation time is in the past, only future reservations are allowed
  // e.g., if it is noon, only allow reservations starting after noon today

  next();
}

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
    hasRequiredProperties,
    hasOnlyValidProperties,
    hasValidPeople,
    hasValidReservationDate,
    hasValidReservationTime,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
};
