const app = require('../../index').app;
const chai = require('chai');
const request = require('supertest');
const utils = require('../utils');

const expect = chai.expect;

describe('Get Users', function () {
  describe('GET / users - Empty', function () {
    it('should get empty list of Users', async function () {
      const res = await new Promise((resolve, reject) => {
        request(app)
          .get('/v1/users')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.empty;
    });
  });

  describe('GET / users - Two Users', function () {
    it('should get list of users with two Users', async function () {
      let user = await utils.addUser();
      let secondUser = await utils.addUser();
      user = utils.serialize(user);
      secondUser = utils.serialize(secondUser);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .get('/v1/users')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      })
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
      expect(res.body).to.deep.contain(user);
      expect(res.body).to.deep.contain(secondUser);
    });
  });
});

describe('Get User : Username', function () {
  describe('GET / users : usermane', function () {
    it('should get the user', async function () {
      const username = 'JohnDoe45';
      let user = await utils.addUser({ username: username });
      user = utils.serialize(user);
      const res = await new Promise((resolve, reject) => {
        request(app)
          .get(`/v1/users/${username}`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.deep.equal(user);
    });
  });

  describe('GET / users : usermane - Incorrect Username', function () {
    it('should return error because username is incorrect', async function () {
      await utils.addUser({ username: 'Johhnny' });
      const res = await new Promise((resolve, reject) => {
        request(app)
          .get('/v1/users/incorrect')
          .set('Accept', 'application/json')
          .end((err, res) => {
            resolve(res);
          });
      });
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body['name']).to.equal('NotFoundException');
      expect(res.body['message']).to.equal('User does not exist');
    });
  });
});

describe('Post User', function () {
  describe('POST / users', function () {
    it('should post the user', async function () {
      const userToAdd = utils.createUser({ username: 'Maria' });
      const user = await utils.addUser();

      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
          .send(userToAdd)
          .end((err, res) => {
            resolve(res);
          });
      });

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      expect(res.body.username).to.equal('Maria');
    });
  });

  describe('POST / users - Repeated Username', function () {
    it('should return error because user has repeated Username', async function () {
      const username = 'JohnDoe';
      const userToAdd = utils.createUser({ username: username });
      const user = await utils.addUser({ username: username });

      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
          .send(userToAdd)
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

  describe('POST / users - Repeated Email', function () {
    it('should return error because user has repeated Email', async function () {
      const email = 'johnny@gmail.com';
      const userToAdd = utils.createUser({ email: email });
      const user = await utils.addUser({ email: email });

      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
          .send(userToAdd)
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

  describe('POST / users - Repeated fbId', function () {
    it('should return error because user has repeated fbId', async function () {
      const fbId = 'JohnnysFB';
      const userToAdd = utils.createUser({ fbId: fbId });
      const user = await utils.addUser({ fbId: fbId });

      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
          .send(userToAdd)
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

  describe('POST / users - No User', function () {
    it('should return error because user was not sent', async function () {
      const user = await utils.addUser();

      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
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

  describe('POST / users - Empty User', function () {
    it('should return error because user is empty', async function () {
      const user = await utils.addUser();

      const auth_token = await utils.login(user.id);

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${auth_token}`)
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

  describe('POST / users - No Authorization Token', function () {
    it('should throw error because an authorization token was not provided', async function () {
      const userToAdd = utils.createUser();

      const res = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .send(userToAdd)
          .end(function (err, res) {
            resolve(res);
          });
      })
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Unauthorized');
    });
  });
});
