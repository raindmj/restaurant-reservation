const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(create)],
};
