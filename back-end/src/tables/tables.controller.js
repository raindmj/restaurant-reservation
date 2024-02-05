const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/*
 * Validation middleware
 */

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({
      status: 404,
      message: `Table with id ${table_id} does not exist.`,
    });
  }
}

/**
 * List handler for table resources
 */
async function list(req, res, next) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

/*
 * Create a new table
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
 * Get info on one table given table id
 */

function read(req, res, next) {
  const { table } = res.locals;
  res.json({ data: table });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(create)],
  read,
};
