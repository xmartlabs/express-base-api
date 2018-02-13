const app = require('../index').app;
const chai = require('chai');
const request = require('supertest');
const utils = require('./utils');

const expect = chai.expect;

describe('Post device', () => {
  describe('POST / devices', () => {
    it('should post the device', async () => {
      const deviceToAdd = utils.createDevice('1', 'Mobile', '1');
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/devices')
          .set('Accept', 'application/json')
          .send(deviceToAdd)
          .end((err, res) => {
            resolve(res);
          });
      });

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      expect(res.body.deviceId).to.equal('1');
      expect(res.body.deviceType).to.equal('Mobile');
      expect(res.body.pnToken).to.equal('1');
      expect(res.body.user_id).to.be.a('null');
    });
  });

  describe('POST / devices - Repeated DeviceId', () => {
    it('should return error because device has repeated deviceId', async () => {
      const deviceId = 'myDeviceId';
      const deviceToAdd = utils.createDevice(deviceId, 'Mobile', '1');
      await utils.addDevice(deviceId, 'Ipad', '2');

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/devices')
          .set('Accept', 'application/json')
          .send(deviceToAdd)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('RepeatedObjectException');
      expect(res.body.message).to.equal('Device with repeated credentials');
    });
  });

  describe('POST / devices - No Device', () => {
    it('should return error because device was not sent', async () => {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/devices')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('MissingDataException');
      expect(res.body.message).to.equal('Missing data from device');
    });
  });

  describe('POST / devices - Empty Device', () => {
    it('should return error because device is empty', async () => {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/devices')
          .set('Accept', 'application/json')
          .send({})
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('MissingDataException');
      expect(res.body.message).to.equal('Missing data from device');
    });
  });
});
