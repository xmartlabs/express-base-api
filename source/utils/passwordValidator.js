const common = require('./common');
const { MissingDataException } = require('../errors');

exports.throwExceptionIfNotValidPassword = (password) => {
  //Must have al least 6 characters, 1 number, 1 letter in upercase and 1 letter in lowercase
  if (common.isEmptyOrWhiteSpace(password)) throw new MissingDataException('The password can not be empty or white space', {'password': undefined});
  if (!common.isSixCharactersOrLonger(password)) throw new MissingDataException('The password must have six characters or more', {'password': undefined});
  if (!common.hasNumber(password)) throw new MissingDataException('The password must have at least one number', {'password': undefined});
  if (!common.hasLowerCase(password)) throw new MissingDataException('The password must have at least one lowercase letter', {'password': undefined});
  if (!common.hasUpperCase(password)) throw new MissingDataException('The password must have at least one uppercase letter', {'password': undefined});
};
