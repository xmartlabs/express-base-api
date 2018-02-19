const deviceDAO = require('../../source/dao/deviceDAO');
const userDAO = require('../../source/dao/userDAO');

const validateEmptyDeviceFieldsStub = (sandbox) => {
  return sandbox.stub(deviceDAO, '_validateEmptyDeviceFields').callsFake(function () {
    return;
  });
};

const validateEmptyUserFieldsStub = (sandbox) => {
  return sandbox.stub(userDAO, '_validateEmptyUserFields').callsFake(function () {
    return;
  });
};

const validateRepeatedDeviceStub = (sandbox) => {
  return sandbox.stub(deviceDAO, '_validateRepeatedDevice').callsFake(function () {
    return new Promise((resolve) => {
      resolve();
    });
  });
};


const validateRepeatedUserStub = (sandbox) => {
  return sandbox.stub(userDAO, '_validateRepeatedUser').callsFake(function () {
    return new Promise((resolve) => {
      resolve();
    });
  });
};

module.exports = {
  validateRepeatedDeviceStub,
  validateEmptyDeviceFieldsStub,
  validateRepeatedUserStub,
  validateEmptyUserFieldsStub,
};
