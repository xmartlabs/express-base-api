const { MissingDataException, RepeatedObjectException  } = require('../errors');

exports.exceptionWrapper = (wrappedFunction) => {
  return async (...params) => {
    try {
      return await wrappedFunction(...params);
    } catch (error) {

      //TODO: Add all custom defined Errors
      switch (error.name) {
        case "SequelizeUniqueConstraintError":
          throw new RepeatedObjectException(error.errors[0].message, error.fields);
        case "SequelizeValidationError":
          switch (error.errors[0].validatorKey) {
            case "not_unique":
              throw new RepeatedObjectException(error.errors[0].message, error.fields);
            case "is_null":
            case "notEmpty":
              throw new MissingDataException(error.errors[0].message);
          }
      }
      //If no API error was found re-throw the original one
      throw error;
    }

  }
}

