const { MissingDataException } = require('../errors');

exports.exceptionWrapper = (wrappedFunction) => {
    return async (...params) => {
        try {
            return await wrappedFunction(...params);
        } catch (error) {
            console.log(error)
            //TODO: Add all custom defined Errors
            switch (error.name) {
                case "SequelizeUniqueConstraintError":
                    let errMsg = error.errors[0].message;
                    throw new MissingDataException(errMsg);//'Missing data from user');
                    break;
                default:
                    throw error;
            }
        }

    }
}

