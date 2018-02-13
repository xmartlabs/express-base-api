const app = require('../index').app;
const deviceDAO = require('../source/dao/deviceDAO');
const request = require('supertest');
const userDAO = require('../source/dao/userDAO');
const userSerializer = require('../source/api/v1/user/userSerializer');

const addUser = async (username, email, fbId) => {
  const userToAdd = createUser(username, email, fbId, 'Password');
  const user = await userDAO.addUser(userToAdd);
  return user;
};

const addDevice = async (deviceId, deviceType, pnToken) => {
  const deviceToAdd = createDevice(deviceId, deviceType, pnToken);
  const device = await deviceDAO.addDevice(deviceToAdd);
  return device;
}

const createDevice = (deviceId, deviceType, pnToken) => {
  return {
    deviceId: deviceId,
    deviceType: deviceType,
    pnToken: pnToken,
  };
}

const createUser = (username, email, fbId, password) => {
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

const login = async (username, password) => {
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

const serialize = (user) => {
  let serializedUser = JSON.stringify(user);
  serializedUser = JSON.parse(serializedUser);
  return userSerializer.serialize(serializedUser);
};

const sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

module.exports = {
  addUser,
  addDevice,
  createDevice,
  createUser,
  login,
  serialize,
  sleep,
}
