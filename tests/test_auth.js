const app = require('../index').app;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const chai = require('chai');
const request = require('supertest');
const utils = require('./utils');

const expect = chai.expect;

describe('Login', function () {
  describe('POST / login', function () {
    it('should get the token', async function () {
      const username = 'JohnDoe45';
      await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/login')
          .set('Accept', 'application/json')
          .send({
            'username': username,
            'password': 'Password'
          })
          .end(function (err, res) {
            resolve(res);
          });
      })
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body['status']).to.equal('success');
      expect(res.body['message']).to.equal('Successfully logged in.');
      expect(res.body['auth_token']).to.not.be.empty;
    });
  });

  describe('POST / login - Not Registered User', function () {
    it('should throw error because user is not registered', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/login')
          .set('Accept', 'application/json')
          .send({
            'username': 'JohnDoe16',
            'password': 'Password'
          })
          .end(function (err, res) {
            resolve(res);
          });
      })
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body['message']).to.equal('User does not exist');
    });
  });

  describe('POST / login - Empty User', function () {
    it('should throw error because user is empty', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/login')
          .set('Accept', 'application/json')
          .send({})
          .end(function (err, res) {
            resolve(res);
          });
      })
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body['message']).to.equal('Missing credentials');
    });
  });

});
