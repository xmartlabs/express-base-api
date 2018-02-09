const app = require('../index').app;
const chai = require('chai');
const encryption = require('../source/api/utils/encryption');
const MissingDataException = require('../source/errors/MissingDataException');
const NotFoundException = require('../source/errors/NotFoundException');
const RepeatedObjectException = require('../source/errors/RepeatedObjectException');
const request = require('supertest');
const userDAO = require('../source/dao/userDAO');
const utils = require('./utils');

const expect = chai.expect;

describe('Add User', () => {
  describe('Add User', () => {
    it('should add the User', async () => {
      const userToAdd = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', 'Password');
      const user = await userDAO.addUser(userToAdd);

      expect(user).to.be.an('object');
      expect(user).to.have.property('id');
      expect(user.username).to.equal('Maria');
      expect(user.email).to.equal('Mery@Doe.com');
      expect(user.fbId).to.equal('fbIdMery');
    });
  });

  describe('Add User - Password Encrypted', () => {
    it('should add the User password encrypted', async () => {
      const password = 'Password';
      const userToAdd = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', password);
      const user = await userDAO.addUser(userToAdd);

      const isPasswordCorrect = encryption.compare(password, user['password']);
      expect(user).to.be.an('object');
      expect(isPasswordCorrect).to.equal(true);
    });
  });
});

describe('Get All Users', () => {
  it('should get all the Users', async () => {
    const user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
    const users = await userDAO.getAllUsers();

    expect(users).to.be.an('array');
    expect(users).to.have.lengthOf(1);
    expect(users).to.deep.contain(user);
  });
});

describe('Get User by Id', () => {
  describe('Get User by Id', () => {
    it('should get the User', async () => {
      const user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      const obtainedUser = await userDAO.getUserById(user.id);

      expect(obtainedUser).to.be.an('object');
      expect(obtainedUser).to.deep.equal(user);
    });
  });

  describe('Get User by Id - Incorrect Id', () => {
    it('should throw exception because id is incorrect', async () => {
      let throwsError = false;
      const user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      try {
        await userDAO.getUserById(user.id+1);
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Get User by Username', () => {
  describe('Get User by Username', () => {
    it('should get the User', async () => {
      const username = 'JohnDoe45';
      const user = await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');
      const obtainedUser = await userDAO.getUserByUsername(username);

      expect(obtainedUser).to.be.an('object');
      expect(obtainedUser).to.deep.equal(user);
    });
  });

  describe('Get User by Username - Incorrect Username', () => {
    it('should throw exception because username is incorrect', async () => {
      let throwsError = false;
      await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      try {
        await userDAO.getUserByUsername('incorrect')
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Empty Fields', () => {
  describe('Validate Empty Fields', () => {
    it('should not throw exception for empty fields', async () => {
      let throwsError = false;
      const user = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', 'Password');
      try {
        userDAO.validateEmptyUserFields(user);
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Empty Fields - Empty User', () => {
    it('should throw exception because user is empty', async () => {
      let throwsError = false;
      try {
        userDAO.validateEmptyUserFields({});
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields - Empty Username', () => {
    it('should throw exception because username is empty', async () => {
      let throwsError = false;
      const user = utils.createUser('', 'Mery@Doe.com', 'fbIdMery', 'Password');
      try {
        userDAO.validateEmptyUserFields(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields - Empty Email', () => {
    it('should throw exception because email is empty', async () => {
      let throwsError = false;
      const user = utils.createUser('Maria', '', 'fbIdMery', 'Password');
      try {
        userDAO.validateEmptyUserFields(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields - Empty fbId', () => {
    it('should throw exception because fbId is empty', async () => {
      let throwsError = false;
      const user = utils.createUser('Maria', 'Mery@Doe.com', '', 'Password');
      try {
        userDAO.validateEmptyUserFields(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields - Empty Password', () => {
    it('should throw exception because password is empty', async () => {
      let throwsError = false;
      const user = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', '');
      try {
        userDAO.validateEmptyUserFields(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Repeated User', () => {
  describe('Validate Repeated User', () => {
    it('should not throw exception for repeated user', async () => {
      let throwsError = false;
      const user = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery', 'Password');
      try {
        await userDAO.validateRepeatedUser(user)
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Repeated User - Repeated', () => {
    it('should throw exception because user is repeated', async () => {
      let throwsError = false;
      const user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
      try {
        await userDAO.validateRepeatedUser(user)
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});
