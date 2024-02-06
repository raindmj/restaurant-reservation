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
// then update reservations with new status
async function update(updatedTable, updatedReservation) {
  const trx = await knex.transaction();

  return trx("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedTablesRecords) => updatedTablesRecords[0])
    .then(async () => {
      return trx("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updatedReservationsRecords) => updatedReservationsRecords[0]);
    })
    .then(trx.commit)
    .catch(trx.rollback);
}

module.exports = {
  list,
  create,
  read,
  update,
};
