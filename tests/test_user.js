const app = require('../index').app;
const chai = require('chai');
const request = require('supertest');
const utils = require('./utils');

const expect = chai.expect;

describe('Get Users', () => {
  describe('GET / users - Empty', () => {
    it('should get empty list of Users', (done) => {
      request(app)
        .get('/v1/users')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe('GET / users - Two Users', () => {
    it('should get list of users with two Users', async () => {
      let user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      let secondUser = await utils.addUser('JohnDoe46', 'John2@Doe.com', 'fbIdJohn2');
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

describe('Get User : Username', () => {
  describe('GET / users : usermane', () => {
    it('should get the user', async () => {
      const username = 'JohnDoe45';
      let user = await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');
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

  describe('GET / users : usermane - Incorrect Username', () => {
    it('should return error because username is incorrect', async () => {
      await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      const res = await new Promise((resolve, reject) => {
        request(app)
          .get('/v1/users/a')
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

describe('Post User', () => {
  describe('POST / users', () => {
    it('should post the user', async () => {
      const userToAdd = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', 'Password');
      const username = 'JohnDoe45';
      await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');

      const auth_token = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': username,
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res.body.auth_token);
          });
      });

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
      expect(res.body.email).to.equal('Mery@Doe.com');
      expect(res.body.fbId).to.equal('fbIdMery');
    });
  });

  describe('POST / users - Repeated Username', () => {
    it('should return error because user has repeated Username', async () => {
      const username = 'myUsername';
      const userToAdd = utils.createUser(username, 'Mery@Doe.com', 'fbIdMery', 'Password');
      await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');

      const auth_token = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': username,
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res.body.auth_token);
          });
      });

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
      expect(res.body.message).to.equal('User with repeated credentials');
    });
  });

  describe('POST / users - Repeated Email', () => {
    it('should return error because user has repeated Email', async () => {
      const email = 'myEmail@gmail.com';
      const userToAdd = utils.createUser('Mery', email, 'fbIdMery', 'Password');
      await utils.addUser('John', email, 'fbIdJohn');

      const auth_token = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': 'John',
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res.body.auth_token);
          });
      });

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

  describe('POST / users - Repeated fbId', () => {
    it('should return error because user has repeated fbId', async () => {
      const fbId = 'myFbId';
      const userToAdd = utils.createUser('Mery', 'Mery@Doe.com', fbId, 'Password');
      await utils.addUser('John', 'John@Doe.com', fbId);

      const auth_token = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': 'John',
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res.body.auth_token);
          });
      });

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

  describe('POST / users - No User', () => {
    it('should return error because user was not sent', async () => {
      await utils.addUser('John', 'John@Doe.com', 'fbIdJohn');

      const auth_token = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': 'John',
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res.body.auth_token);
          });
      });

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

  describe('POST / users - Empty User', () => {
    it('should return error because user is empty', async () => {
      await utils.addUser('John', 'John@Doe.com', 'fbIdJohn');

      const auth_token = await new Promise((resolve, reject) => {
        request(app)
          .post('/v1/auth/login')
          .set('Accept', 'application/json')
          .send({
            'username': 'John',
            'password': 'Password'
          })
          .end((err, res) => {
            resolve(res.body.auth_token);
          });
      });

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
});
