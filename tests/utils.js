const app = require('../index').app;
const request = require('supertest');
const { User } = require('../source/models');
const userDAO = require('../source/dao/userDAO');
const userSerializer = require('../source/api/v1/user/userSerializer');

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

exports.login = async (username, password) => {
  const res = await new Promise((resolve, reject) => {
    request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        'username': username,
        'password': password
      })
      .end((err, res) => {
        resolve(res);
      });
  });
  return res.body.auth_token;
};

exports.serialize = (user) => {
  let serializedUser = JSON.stringify(user);
  serializedUser = JSON.parse(serializedUser);
  return userSerializer.serialize(serializedUser);
};

exports.sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
