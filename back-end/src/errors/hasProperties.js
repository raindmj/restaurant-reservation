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

      if (invalidFields.length > 1) {
        const error = new Error(
          `The following properties are required: ${invalidFields.join(", ")}`
        );
        error.status = 400;
        throw error;
      }

      if (invalidFields.length === 1) {
        const error = new Error(
          `The following property is required: ${invalidFields.join(", ")}`
        );
        error.status = 400;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
