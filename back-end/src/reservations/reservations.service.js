const knex = require("../db/connection");

// list all of the information from reservations table
// reservation_id, created_at, updated_at, first_name, last_name, mobile_number, reservation_date, reservation_time, people
function list() {
  return knex("reservations").select("*");
}

module.exports = {
  list,
};
