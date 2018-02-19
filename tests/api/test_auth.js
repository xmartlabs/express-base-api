const app = require('../../index').app;
const chai = require('chai');
const request = require('supertest');
const utils = require('../utils');

const expect = chai.expect;

describe('Login', function () {
  describe('POST / login', function () {
    it('should get the token', async function () {
      const username = 'JohnDoe45';
      const password = 'Password';
      await utils.addUser({ username: username, password: password });

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
      const user = await utils.addUser();
      const auth_token = await utils.login(user.id);

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
      const userToRegister = utils.createUser();

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
      const username = 'johhny12';
      const userToRegister = utils.createUser({ username: username });
      await utils.addUser({ username: username });

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
      const email = 'johhny12@gmail.com';
      const userToRegister = utils.createUser({ email: email });
      await utils.addUser({ email: email });

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
      const fbId = 'johhny12';
      const userToRegister = utils.createUser({ fbId: fbId });
      await utils.addUser({ fbId: fbId });

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
