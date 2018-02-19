const app = require('../index').app;
const appConfig = require('config');
const deviceDAO = require('../source/dao/deviceDAO');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const jwtTokenGenerator = require('../source/api/authMiddlewares/jwtTokenGenerator');
const request = require('supertest');
const userDAO = require('../source/dao/userDAO');
const userSerializer = require('../source/api/v1/user/userSerializer');

faker.seed(42);

const addUser = async (user) => {
  const userToAdd = createUser(user);
  return await userDAO.addUser(userToAdd);
};

const addDevice = async (device) => {
  const deviceToAdd = createDevice(device);
  return await deviceDAO.addDevice(deviceToAdd);
}

const createDevice = (device) => {
  return {
    deviceId: faker.random.uuid(),
    deviceType: faker.random.word(),
    pnToken: faker.random.uuid(),
    ...device,
  };
}

const createUser = (user) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    cellPhoneNumber: faker.phone.phoneNumber(),
    cellPhoneCountyCode: faker.random.number(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fbId: faker.random.word(),
    fbAccessToken: faker.random.uuid(),
    emailValidationCode: '1234',
    emailValidationCodeExpiration: new Date(),
    emailValidationDate: new Date(),
    cellPhoneValidationCode: '1234',
    cellPhoneValidationCodeExpiration: new Date(),
    cellPhoneValidationDate: new Date(),
    ...user,
  };
};

const login = async (userId) => {
  return jwtTokenGenerator(userId);
};

const serialize = (user) => {
  let serializedUser = JSON.stringify(user);
  serializedUser = JSON.parse(serializedUser);
  return userSerializer.serialize(serializedUser);
};

const sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

const verifyJwtToken = (token) => {
  return jwt.verify(token, appConfig.get('secretKey'));

};

module.exports = {
  addUser,
  addDevice,
  createDevice,
  createUser,
  login,
  serialize,
  sleep,
  verifyJwtToken,
}
