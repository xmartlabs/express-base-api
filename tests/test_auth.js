const app = require('../index').app;
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
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': username,
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Successfully logged in.');
      expect(res.body.auth_token).to.not.be.empty;
    });
  });

  describe('POST / login - Not Registered User', function () {
    it('should return error because user is not registered', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': 'JohnDoe16',
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Forbidden');
    });
  });

  describe('POST / login - No User', function () {
    it('should return error because user was not sent', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      })
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Missing credentials');
    });
  });

  describe('POST / login - Empty User', function () {
    it('should return error because user is empty', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({})
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Missing credentials');
    });
  });
});

describe('Logout', function () {
  describe('GET / logout', function () {
    it('should logout the user', async function () {
      const username = 'JohnDoe45';
      await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');
      //Login
      const auth_token = await utils.login(username, 'Password');
      //Logout
      const res = await new Promise((resolve, reject) => {
        request(app)
          .get('/v1/auth/logout')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Successfully logged out');
    });
  });
});

describe('Register User', function () {
  describe('POST / register', function () {
    it('should get the token from the recent registered user', async function () {
      const userToRegister = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', 'Password');

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/register')
          .set('Accept', 'application/json')
          .send(userToRegister)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Successfully logged in.');
      expect(res.body.auth_token).to.not.be.empty;
    });
  });

  describe('POST / register - Repeated Username', function () {
    it('should return error because user has repeated Username', async function () {
      const username = 'myUsername';
      const userToRegister = utils.createUser(username, 'Mery@Doe.com', 'fbIdMery', 'Password');
      await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/register')
          .set('Accept', 'application/json')
          .send(userToRegister)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('RepeatedObjectException');
      expect(res.body.message).to.equal('User with repeated credentials');
    });
  });

  describe('POST / register - Repeated Email', function () {
    it('should return error because user has repeated Email', async function () {
      const email = 'myEmail@gmail.com';
      const userToRegister = utils.createUser('Mery', email, 'fbIdMery', 'Password');
      await utils.addUser('John', email, 'fbIdJohn');

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/register')
          .set('Accept', 'application/json')
          .send(userToRegister)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body['name']).to.equal('RepeatedObjectException');
      expect(res.body['message']).to.equal('User with repeated credentials');
    });
  });

  describe('POST / register - Repeated fbId', function () {
    it('should return error because user has repeated fbId', async function () {
      const fbId = 'myFbId';
      const userToRegister = utils.createUser('Mery', 'Mery@Doe.com', fbId, 'Password');
      await utils.addUser('John', 'John@Doe.com', fbId);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/register')
          .set('Accept', 'application/json')
          .send(userToRegister)
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('RepeatedObjectException');
      expect(res.body.message).to.equal('User with repeated credentials');
    });
  });

  describe('POST / register - No User', function () {
    it('should return error because user was not sent', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/register')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('MissingDataException');
      expect(res.body.message).to.equal('Missing data from user');
    });
  });

  describe('POST / register - Empty User', function () {
    it('should return error because user is empty', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/register')
          .set('Accept', 'application/json')
          .send({})
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('MissingDataException');
      expect(res.body.message).to.equal('Missing data from user');
    });
  });
});
