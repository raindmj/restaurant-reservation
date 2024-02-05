const knex = require("../db/connection");

// list all of the information from tables table, ordered by table name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// create a new table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTables) => createdTables[0]);
}

// find a single table given table id

module.exports = {
  list,
  create,
};
