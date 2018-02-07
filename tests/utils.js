const { User } = require('../source/models');
const userDAO = require('../source/dao/userDAO');

exports.addUser = async (username, email, fbId) => {
  const userToAdd = {
    firstName: 'John',
    lastName: 'Doe',
    email: email,
    cellPhoneNumber: '096568956',
    cellPhoneCounty_code: '00598',
    username: username,
    password: 'Password',
    fbId: fbId,
    fbAccessToken: 'JohnsToken',
    emailValidationCode: '1234',
    emailPhoneValidationCodeExpiration: new Date(),
    emailValidationDate: new Date(),
    cellPhoneValidationCode: '1234',
    cellPhoneValidationCodeExpiration: new Date(),
    cellPhoneValidationDate: new Date()
  };

  const user = await userDAO.addUser(userToAdd);
  return user;
};

exports.createUser = (username, email, fbId, password) => {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: email,
    cellPhoneNumber: '096568956',
    cellPhoneCounty_code: '00598',
    username: username,
    password: password,
    fbId: fbId,
    fbAccessToken: 'JohnsToken',
    emailValidationCode: '1234',
    emailPhoneValidationCodeExpiration: new Date(),
    emailValidationDate: new Date(),
    cellPhoneValidationCode: '1234',
    cellPhoneValidationCodeExpiration: new Date(),
    cellPhoneValidationDate: new Date()
  };
};

exports.sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

exports.serialize = (user) => {
  let serializedUser = JSON.stringify(user);
  return JSON.parse(serializedUser);
};
