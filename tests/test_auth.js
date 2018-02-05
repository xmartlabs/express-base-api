const app = require('../index').app;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const chai = require('chai');
const request = require('supertest');
const utils = require('./utils');

const expect = chai.expect;

describe('Login', () => {
  describe('POST / login', () => {
    it('should get the token', async () => {
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
      expect(res.body['status']).to.equal('success');
      expect(res.body['message']).to.equal('Successfully logged in.');
      expect(res.body['auth_token']).to.not.be.empty;
    });
  });

  describe('POST / login - Not Registered User', () => {
    it('should return error because user is not registered', async () => {
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
      expect(res.body['message']).to.equal('User does not exist');
    });
  });

  describe('POST / login - No User', () => {
    it('should return error because user was not sent', async () => {
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
      expect(res.body['message']).to.equal('Missing credentials');
    });
  });

  describe('POST / login - Empty User', () => {
    it('should return error because user is empty', async () => {
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
      expect(res.body['message']).to.equal('Missing credentials');
    });
  });
});

describe('Register User', () => {
  describe('POST / register', () => {
    it('should get the token from the recent registered user', async () => {
      const userToRegister = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery');

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
      expect(res.body['status']).to.equal('success');
      expect(res.body['message']).to.equal('Successfully logged in.');
      expect(res.body['auth_token']).to.not.be.empty;
    });
  });

  describe('POST / register - Repeated Username', () => {
    it('should return error because user has repeated Username', async () => {
      const username = 'myUsername';
      const userToRegister = utils.createUser(username, 'Mery@Doe.com', 'fbIdMery');
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
      expect(res.body['name']).to.equal('RepeatedObjectException');
      expect(res.body['message']).to.equal('User with repeated credentials');
    });
  });

  describe('POST / register - Repeated Email', () => {
    it('should return error because user has repeated Email', async () => {
      const email = 'myEmail@gmail.com';
      const userToRegister = utils.createUser('Mery', email, 'fbIdMery');
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

  describe('POST / register - Repeated fbId', () => {
    it('should return error because user has repeated fbId', async () => {
      const fbId = 'myFbId';
      const userToRegister = utils.createUser('Mery', 'Mery@Doe.com', fbId);
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
      expect(res.body['name']).to.equal('RepeatedObjectException');
      expect(res.body['message']).to.equal('User with repeated credentials');
    });
  });

  describe('POST / register - No User', () => {
    it('should return error because user was not sent', async () => {
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
      expect(res.body['name']).to.equal('MissingDataException');
      expect(res.body['message']).to.equal('Missing data from user');
    });
  });

  describe('POST / register - Empty User', () => {
    it('should return error because user is empty', async () => {
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
      expect(res.body['name']).to.equal('MissingDataException');
      expect(res.body['message']).to.equal('Missing data from user');
    });
  });
});
