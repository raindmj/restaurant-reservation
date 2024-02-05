const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/*
 * Validation middleware
 */

// check if table with table_id exists
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

const VALID_PROPERTIES = ["table_name", "capacity"];

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
const hasRequiredProperties = hasProperties("table_name", "capacity");

// check whether table has:
// 1. table_name that is at least 2 characters long
// 2. capacity is at least 1 person
function isValidTable(req, res, next) {
  const { table_name, capacity } = req.body.data;

  if (table_name.length < 2) {
    next({
      status: 400,
      message: "The table_name field must be at least 2 characters long.",
    });
  }

  if (!Number.isInteger(capacity)) {
    next({
      status: 400,
      message: "The capacity field must be a number.",
    });
  }

  if (capacity < 1) {
    next({
      status: 400,
      message: "The capacity must be at least 1 person.",
    });
  }

  next();
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
  create: [
    hasRequiredProperties,
    hasOnlyValidProperties,
    isValidTable,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
};
