const app = require('../../index').app;
const chai = require('chai');
const deviceDAO = require('../../source/dao/deviceDAO');
const { MissingDataException, NotFoundException, RepeatedObjectException } = require('../../source/errors');
const utils = require('../utils');
const { validateRepeatedDeviceStub, validateEmptyDeviceFieldsStub } = require('../stubs');

const expect = chai.expect;

describe('Add Device', function () {
  it('should add the Device', async function () {
    const deviceToAdd = utils.createDevice({ deviceId: '1' });
    const device = await deviceDAO.addDevice(deviceToAdd);

    expect(device).to.be.an('object');
    expect(device).to.have.property('id');
    expect(device.deviceId).to.equal('1');
    expect(device.userId).to.be.a('null');
  });

  describe('Add Device - Validate Repeated Device', function () {
    it('should call the validation method for repeated Device', async function () {
      const device = utils.createDevice();
      const validatorStub = validateRepeatedDeviceStub(this.sandbox);
      await deviceDAO.addDevice(device);

      expect(validatorStub).to.be.calledWith(device);
    });
  });

  describe('Add Device - Validate Empty Fields', function () {
    it('should call the validation method for empty Device fields', async function () {
      const device = utils.createDevice();
      const validatorStub = validateEmptyDeviceFieldsStub(this.sandbox);
      await deviceDAO.addDevice(device);

      expect(validatorStub).to.be.calledWith(device);
    });
  });
});

describe('Change User from Device', function () {
  describe('Change User from Device', function () {
    it('should not throw exception when changing the user', async function () {
      const user = await utils.addUser();
      const device = await utils.addDevice();
      const deviceChanged = await deviceDAO.changeUserfromDevice(device.deviceId, user.id);

      expect(deviceChanged).to.equal(true);
    });
  });

  describe('Change User from Device - Incorrect Device Id', function () {
    it('should throw exception because deviceId is incorrect', async function () {
      let throwsError = false;
      const user = await utils.addUser();
      try {
        await deviceDAO.changeUserfromDevice('1', user.id);
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Change User from Device - Incorrect User Id', function () {
    it('should throw exception because userId is incorrect', async function () {
      let throwsError = false;
      const device = await utils.addDevice();
      try {
        await deviceDAO.changeUserfromDevice(device.deviceId, '1');
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Get Device by Id', function () {
  describe('Get Device by Id', function () {
    it('should get the Device', async function () {
      const device = await utils.addDevice();
      const obtainedDevice = await deviceDAO.getDeviceById(device.deviceId);

      expect(obtainedDevice).to.be.an('object');
      expect(obtainedDevice).to.deep.equal(device);
    });
  });

  describe('Get Device by Id - Incorrect Id', function () {
    it('should throw exception because id is incorrect', async function () {
      let throwsError = false;
      const device = await utils.addDevice();
      try {
        await deviceDAO.getDeviceById(device.deviceId + 1);
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Empty Fields of Device', function () {
  describe('Validate Empty Fields of Device', function () {
    it('should not throw exception for empty fields', async function () {
      let throwsError = false;
      const device = utils.createDevice();
      try {
        deviceDAO._validateEmptyDeviceFields(device);
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Empty Fields of Device - Empty Device', function () {
    it('should throw exception because device is empty', async function () {
      let throwsError = false;
      try {
        deviceDAO._validateEmptyDeviceFields({});
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of Device - Empty DeviceId', function () {
    it('should throw exception because deviceId is empty', async function () {
      let throwsError = false;
      const device = utils.createDevice({ deviceId: '' });
      try {
        deviceDAO._validateEmptyDeviceFields(device);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of Device - Empty DeviceType', function () {
    it('should throw exception because deviceType is empty', async function () {
      let throwsError = false;
      const device = utils.createDevice({ deviceType: '' });
      try {
        deviceDAO._validateEmptyDeviceFields(device);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of Device - Empty pnToken', function () {
    it('should throw exception because pnToken is empty', async function () {
      let throwsError = false;
      const device = utils.createDevice({ pnToken: '' });
      try {
        deviceDAO._validateEmptyDeviceFields(device);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Repeated Device', () => {
  describe('Validate Repeated Device', () => {
    it('should not throw exception for repeated device', async function () {
      let throwsError = false;
      const device = utils.createDevice();
      try {
        await deviceDAO._validateRepeatedDevice(device)
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Repeated Device - Repeated DeviceId', () => {
    it('should throw exception because deviceId is repeated', async function () {
      const deviceId = '123';
      let throwsError = false;
      const device = await utils.addDevice({ deviceId: deviceId });
      const deviceToValidate = await utils.createDevice({ deviceId: deviceId });
      try {
        await deviceDAO._validateRepeatedDevice(deviceToValidate)
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Repeated Device - Repeated pnToken', () => {
    it('should throw exception because pnToken is repeated', async function () {
      const pnToken = '12';
      let throwsError = false;
      const device = await utils.addDevice({ pnToken: pnToken });
      const deviceToValidate = await utils.createDevice({ pnToken: pnToken });
      try {
        await deviceDAO._validateRepeatedDevice(deviceToValidate)
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});
