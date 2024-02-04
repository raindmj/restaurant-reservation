const knex = require("../db/connection");

// list all of the information from reservations table
//
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

module.exports = {
  list,
};
