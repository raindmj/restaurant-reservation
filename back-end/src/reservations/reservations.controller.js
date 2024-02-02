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

/* function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function todaysDate() {
  return asDateString(new Date());
}

console.log(todaysDate()); */

function todaysDate2() {
  const date = new Date();

  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });

  const formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}

// console.log(todaysDate2());

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
      // list by today's date
    } else {
      const data = await service.list();
      res.json({ data });
    }
  } catch (error) {
    next(error);
  }
}

/*
 * Read a reservation given reservation_id
 */

module.exports = {
  list: asyncErrorBoundary(list),
};
