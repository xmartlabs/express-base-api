const app = require('../../index').app;
const chai = require('chai');
const { MissingDataException, RepeatedObjectException } = require('../../source/errors');
const deviceDAO = require('../../source/dao/deviceDAO');
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
