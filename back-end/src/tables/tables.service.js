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
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

// update a table with reservation id
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
};
