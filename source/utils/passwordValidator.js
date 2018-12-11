const common = require('./common');
const { MissingDataException } = require('../errors');

exports.validateStrongPassword = (password) => {
  //Must have al least 6 characters, 1 number, 1 letter in upercase and 1 letter in lowercase
  if (common.isEmptyOrWhiteSpace(password)) throw new MissingDataException('The password can not be empty or white space');
  if (!common.isSixCharactersOrLonger(password)) throw new MissingDataException('The password must have six characters or more');
  if (!common.hasNumber(password)) throw new MissingDataException('The password must have at least one number');
  if (!common.hasLowerCase(password)) throw new MissingDataException('The password must have at least one lowercase letter');
  if (!common.hasUpperCase(password)) throw new MissingDataException('The password must have at least one uppercase letter');
};
