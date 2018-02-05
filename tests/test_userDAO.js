const app = require('../index').app;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const chai = require('chai');
const NotFoundException = require('../source/errors/NotFoundException');
const request = require('supertest');
const userDAO = require('../source/dao/userDAO');
const utils = require('./utils');

const expect = chai.expect;

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('Add User', () => {
  it('should add the User', async () => {
    const userToAdd = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery');
    let user = await userDAO.addUser(userToAdd);
    user = utils.serializeUsers(user);

    expect(user).to.be.an('object');
    expect(user).to.have.property('id');
    expect(user['username']).to.equal('Maria');
    expect(user['email']).to.equal('Mery@Doe.com');
    expect(user['fbId']).to.equal('fbIdMery');
  });
});

describe('Get All Users', () => {
  it('should get all the Users', async () => {
    let user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
    let users = await userDAO.getAllUsers();
    users = utils.serializeUsers(users);
    user = utils.serializeUsers(user);

    expect(users).to.be.an('array');
    expect(users).to.have.lengthOf(1);
    expect(users).to.deep.contain(user);
  });
});

describe('Get User by Username', () => {
  describe('Get User by Username', () => {
    it('should get the User', async () => {
      const username = 'JohnDoe45';
      let user = await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');
      let obtainedUser = await userDAO.getUserByUsername(username);
      obtainedUser = utils.serializeUsers(obtainedUser);
      utils.getSecureUser(user);

      expect(obtainedUser).to.be.an('object');
      expect(obtainedUser).to.deep.equal(user);
    });
  });

  describe('Get User by Username - Incorrect Username', () => {
    it('should throw exception because username is incorrect', async () => {
      await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      //let obtainedUser = await userDAO.getUserByUsername('incorrect');

      expect(() => userDAO.getUserByUsername('incorrect')).to.eventually.throw();
    });
  });
});
