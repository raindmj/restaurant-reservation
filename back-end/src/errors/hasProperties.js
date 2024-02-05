function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      let invalidFields = [];

      properties.forEach((property) => {
        if (!data[property]) {
          invalidFields.push(property);
        }
      });

      if (data["people"] === 0) {
        next();
      }

      if (data["capacity"] === 0) {
        next();
      }

      if (invalidFields.length > 1) {
        next({
          status: 400,
          message: `The following properties are required: ${invalidFields.join(
            ", "
          )}`,
        });
      }

      if (invalidFields.length === 1) {
        next({
          status: 400,
          message: `The following property is required: ${invalidFields.join(
            ", "
          )}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
