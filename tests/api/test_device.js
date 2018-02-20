const app = require('../../index').app;
const chai = require('chai');
const request = require('supertest');
const utils = require('../utils');

const expect = chai.expect;

describe('Post device', function () {
  describe('POST / devices', function () {
    it('should post the device', async function () {
      const deviceToAdd = utils.createDevice({ deviceId: '1' });
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
      expect(res.body.userId).to.be.a('null');
    });
  });

  describe('POST / devices - Repeated DeviceId', function () {
    it('should return error because device has repeated deviceId', async function () {
      const deviceId = 'myDeviceId';
      const deviceToAdd = utils.createDevice({ deviceId: '1' });
      await utils.addDevice({ deviceId: '1' });
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

  describe('POST / devices - No Device', function () {
    it('should return error because device was not sent', async function () {
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

  describe('POST / devices - Empty Device', function () {
    it('should return error because device is empty', async function () {
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

describe('Put device', function () {
  describe('PUT/ devices : id', function () {
    it('should bind the Device to the User', async function () {
      const user = await utils.addUser();
      const device = await utils.addDevice();
      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .put(`/v1/devices/${device.deviceId}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.deviceId).to.be.equal(device.deviceId);
      expect(res.body.userId).to.be.equal(user.id);
    });
  });

  describe('PUT/ devices : id - Incorrect deviceId', function () {
    it('should return error because deviceId is incorrect', async function () {
      const user = await utils.addUser();
      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .put('/v1/devices/123')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.be.equal('NotFoundException');
      expect(res.body.message).to.be.equal('Device does not exist');
    });
  });

  describe('PUT/ devices : id - No Authorization Token', function () {
    it('should throw error because an authorization token was not provided', async function () {
      const device = await utils.addDevice();

      const res = await new Promise((resolve, reject) => {
        request(app)
          .put(`/v1/devices/${device.deviceId}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.be.equal('UnauthorizedException');
      expect(res.body.message).to.be.equal('Unauthorized');
    });
  });
});
