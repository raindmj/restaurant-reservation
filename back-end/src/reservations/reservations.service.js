const knex = require("../db/connection");

// list all of the information from reservations table
// reservation_id, created_at, updated_at, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status
function list() {
  return knex("reservations")
    .select("*")
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
}

// list all of the info for a given date
function listByDate(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
}

// search reservations by mobile_number
// ignore all formatting and search only for the digits
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  listByDate,
  search,
};
