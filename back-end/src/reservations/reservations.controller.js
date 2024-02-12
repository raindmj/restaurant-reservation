const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/*
 * Validation middleware
 */

// make sure reservation with given reservation id exists/can be found
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
function isValidPeople(req, res, next) {
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
function isValidDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

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
  const dateAndTime = new Date(`${reservation_date}T${reservation_time}`);

  res.locals.dateAndTime = dateAndTime; // save date to res.locals

  const dayOfTheWeek = dateAndTime.getDay();

  if (dayOfTheWeek === 2) {
    next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });
  }

  next();
}

// check if reservation date and time is in the past, only future reservations are allowed
// e.g., if it is noon, only allow reservations starting after noon today
function isDateAndTimeInFuture(req, res, next) {
  const { dateAndTime } = res.locals;
  const today = new Date();

  if (dateAndTime < today) {
    next({
      status: 400,
      message: "Reservation must be made for a date and time in the future.",
    });
  }

  next();
}

function isValidTime(req, res, next) {
  const { reservation_time } = req.body.data;

  // check format of time, should be HH:MM
  const timeFormatRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  const timeFormatRegexWithSeconds =
    /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

  if (
    !timeFormatRegex.test(reservation_time) &&
    !timeFormatRegexWithSeconds.test(reservation_time)
  ) {
    next({
      status: 400,
      message: `The reservation_time of ${reservation_time} is not a valid time.`,
    });
  }

  // check if reservation time is between 10:30 AM and 9:30 PM
  const earliestReservationTime = "10:30";
  const latestReservationTime = "21:30";

  if (reservation_time <= earliestReservationTime) {
    next({
      status: 400,
      message: "Reservation time must be after 10:30 AM.",
    });
  }

  if (reservation_time >= latestReservationTime) {
    next({
      status: 400,
      message: "Reservation time must be before 9:30 PM.",
    });
  }

  next();
}

// check if mobile number input only accepts numbers and some characters when creating and editing reservation
function isValidMobileNumberForCreateEditReservation(req, res, next) {
  const regexGetOnlyNumbers = /^(?=.*[0-9])[- +()0-9]+$/;

  const { mobile_number } = req.body.data;

  if (!regexGetOnlyNumbers.test(mobile_number)) {
    next({
      status: 400,
      message: "Invalid mobile number.",
    });
  }

  next();
}

// check if mobile number input only accepts numbers and some characters when searching
function isValidMobileNumberForSearch(req, res, next) {
  const regexGetOnlyNumbers = /^(?=.*[0-9])[- +()0-9]+$/;

  const { mobile_number } = req.query;

  if (mobile_number && !regexGetOnlyNumbers.test(mobile_number)) {
    next({
      status: 400,
      message: "Invalid mobile number.",
    });
  }

  next();
}

// define the valid statuses
const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];

// check if inputted status:
// 1. is only one listed in valid status array
// 2: is "finished", then cannot be updated
function isValidStatus(req, res, next) {
  const inputtedStatus = req.body.data.status;
  const currentStatus = res.locals.reservation.status;

  if (!VALID_STATUSES.includes(inputtedStatus)) {
    next({
      status: 400,
      message: `${inputtedStatus} is not a valid status.`,
    });
  }

  if (currentStatus === "finished") {
    next({
      status: 400,
      message: "A reservation with a status of finished cannot be updated.",
    });
  }

  next();
}

// check if new reservation or edited reservation has a booked status
function hasBookedStatus(req, res, next) {
  const { status } = req.body.data;

  if (status === "seated" || status === "finished" || status === "cancelled") {
    next({
      status: 400,
      message: `A new reservation cannot have a status of ${status}.`,
    });
  }

  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  try {
    const { date, mobile_number } = req.query;
    // list by date
    if (date) {
      const data = await service.listByDate(date);
      res.json({ data });
      // list by mobile number
    } else if (mobile_number) {
      const data = await service.search(mobile_number);
      res.json({ data });
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
  const data = res.locals.reservation;
  res.json({ data });
}

/*
 * Update reservation status
 */

async function updateStatus(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;

  const updatedReservation = {
    status,
    reservation_id,
  };

  try {
    const data = await service.update(updatedReservation);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

/*
 * Update reservation info
 */
async function updateReservation(req, res, next) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };

  try {
    const data = await service.update(updatedReservation);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: [isValidMobileNumberForSearch, asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    hasOnlyValidProperties,
    isValidMobileNumberForCreateEditReservation,
    isValidPeople,
    isValidDate,
    isDateAndTimeInFuture,
    isValidTime,
    hasBookedStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    hasOnlyValidProperties,
    isValidMobileNumberForCreateEditReservation,
    isValidPeople,
    isValidDate,
    isDateAndTimeInFuture,
    isValidTime,
    hasBookedStatus,
    asyncErrorBoundary(updateReservation),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    isValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
