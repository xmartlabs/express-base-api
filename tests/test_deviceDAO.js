const app = require('../index').app;
const chai = require('chai');
const MissingDataException = require('../source/errors/MissingDataException');
const RepeatedObjectException = require('../source/errors/RepeatedObjectException');
const request = require('supertest');
const deviceDAO = require('../source/dao/deviceDAO');
const utils = require('./utils');

const expect = chai.expect;

describe('Add Device', () => {
  it('should add the Device', async () => {
    const deviceToAdd = utils.createDevice('1', 'Mobile', '1');
    const device = await deviceDAO.addDevice(deviceToAdd);

    expect(device).to.be.an('object');
    expect(device).to.have.property('id');
    expect(device.deviceId).to.equal('1');
    expect(device.deviceType).to.equal('Mobile');
    expect(device.pnToken).to.equal('1');
    expect(device.user_id).to.be.a('null');
  });
});

describe('Validate Empty Fields of Device', () => {
  describe('Validate Empty Fields of Device', () => {
    it('should not throw exception for empty fields', async () => {
      let throwsError = false;
      const device = utils.createDevice('1', 'Mobile', '1');
      try {
        deviceDAO.validateEmptyDeviceFields(device);
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Empty Fields of Device - Empty Device', () => {
    it('should throw exception because device is empty', async () => {
      let throwsError = false;
      try {
        deviceDAO.validateEmptyDeviceFields({});
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of Device - Empty DeviceId', () => {
    it('should throw exception because deviceId is empty', async () => {
      let throwsError = false;
      const device = utils.createDevice('', 'Mobile', '1');
      try {
        deviceDAO.validateEmptyDeviceFields(device);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of Device - Empty DeviceType', () => {
    it('should throw exception because deviceType is empty', async () => {
      let throwsError = false;
      const device = utils.createDevice('1', '', '1');
      try {
        deviceDAO.validateEmptyDeviceFields(device);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of Device - Empty pnToken', () => {
    it('should throw exception because pnToken is empty', async () => {
      let throwsError = false;
      const device = utils.createDevice('1', 'Mobile', '');
      try {
        deviceDAO.validateEmptyDeviceFields(device);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Repeated Device', () => {
  describe('Validate Repeated Device', () => {
    it('should not throw exception for repeated device', async () => {
      let throwsError = false;
      const device = utils.createDevice('1', 'Mobile', '1');
      try {
        await deviceDAO.validateRepeatedDevice(device)
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Repeated Device - Repeated', () => {
    it('should throw exception because device is repeated', async () => {
      let throwsError = false;
      const device = await utils.addDevice('1', 'Mobile', '1');
      try {
        await deviceDAO.validateRepeatedDevice(device)
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});
