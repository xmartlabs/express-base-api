const chai = require('chai');
const encryption = require('../../source/utils/encryption');
const { MissingDataException, NotFoundException, RepeatedObjectException } = require('../../source/errors');
const sinonchai = require('sinon-chai');
const userDAO = require('../../source/dao/userDAO');
const utils = require('../utils');

chai.use(sinonchai);
const expect = chai.expect;

describe('Add User', function () {
  describe('Add User', function () {
    it('should add the User', async function () {
      const userToAdd = utils.createUser({ username: 'Maria' });
      const user = await userDAO.addUser(userToAdd);

      expect(user).to.be.an('object');
      expect(user).to.have.property('id');
      expect(user.username).to.equal('Maria');
    });
  });

  describe('Add User - Password Encrypted', function () {
    it('should add the User password encrypted', async function () {
      const password = 'Password1';
      const userToAdd = utils.createUser({ password: password });
      const user = await userDAO.addUser(userToAdd);

      const isPasswordCorrect = encryption.compare(password, user.password);
      expect(user).to.be.an('object');
      expect(isPasswordCorrect).to.equal(true);
    });
  });
});

describe('Get All Users', function () {
  it('should get all the Users', async function () {
    const user = await utils.addUser();
    const users = await userDAO.getAllUsers();

    expect(users).to.be.an('array');
    expect(users).to.have.lengthOf(1);
    expect(users).to.deep.contain(user);
  });
});

describe('Get User by Id', function () {
  describe('Get User by Id', function () {
    it('should get the User', async function () {
      const user = await utils.addUser();
      const obtainedUser = await userDAO.getUserById(user.id);

      expect(obtainedUser).to.be.an('object');
      expect(obtainedUser).to.deep.equal(user);
    });
  });

  describe('Get User by Id - Incorrect Id', function () {
    it('should throw exception because id is incorrect', async function () {
      let throwsError = false;
      const user = await utils.addUser();
      try {
        await userDAO.getUserById(user.id + 1);
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Get User by Username', function () {
  describe('Get User by Username', function () {
    it('should get the User', async function () {
      const username = 'JohnDoe45';
      const user = await utils.addUser({ username: username });
      const obtainedUser = await userDAO.getUserByUsername(username);

      expect(obtainedUser).to.be.an('object');
      expect(obtainedUser).to.deep.equal(user);
    });
  });

  describe('Get User by Username - Incorrect Username', function () {
    it('should throw exception because username is incorrect', async function () {
      let throwsError = false;
      await utils.addUser({ username: 'Johnny' });
      try {
        await userDAO.getUserByUsername('Susy')
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Empty Fields of User', function () {
  describe('Validate Empty Fields of User', function () {
    it('should not throw exception for empty fields of User', async function () {
      let throwsError = false;
      const user = utils.createUser();
      try {
        await utils.addUser(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Empty Fields of User - Null User', function () {
    it('should throw exception because user is null', async function () {
      let throwsError = false;
      try {
        await userDAO.addUser(null);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of User - Empty User', function () {
    it('should throw exception because user is empty', async function () {
      let throwsError = false;
      try {
        await userDAO.addUser(null);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of User - Empty Username', function () {
    it('should throw exception because username is empty', async function () {
      let throwsError = false;
      const user = utils.createUser({ username: '' });
      try {
        await utils.addUser(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of User - Empty Email', function () {
    it('should throw exception because email is empty', async function () {
      let throwsError = false;
      const user = utils.createUser({ email: '' });
      try {
        await utils.addUser(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of User - Empty fbId', function () {
    it('should throw exception because fbId is empty', async function () {
      let throwsError = false;
      const user = utils.createUser({ fbId: '' });
      try {
        await utils.addUser(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Empty Fields of User - Empty Password', function () {
    it('should throw exception because password is empty', async function () {
      let throwsError = false;
      const user = utils.createUser({ password: '' });
      try {
        await utils.addUser(user);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});

describe('Validate Repeated User', function () {
  describe('Validate Repeated User', function () {
    it('should not throw exception for repeated user', async function () {
      let throwsError = false;
      try {
        await utils.addUser();
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Repeated User - Repeated Username', function () {
    it('should throw exception because username is repeated', async function () {
      let throwsError = false;
      const username = 'johnny45';
      await utils.addUser({ username: username });
      try {
        await utils.addUser({ username: username });
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Repeated User - Repeated Email', function () {
    it('should throw exception because email is repeated', async function () {
      let throwsError = false;
      const email = 'Someone@Doe.com';
      await utils.addUser({ email: email });
      try {
        await utils.addUser({ email: email });
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Validate Repeated User - Repeated fbId', function () {
    it('should throw exception because fbId is repeated', async function () {
      let throwsError = false;
      const fbId = 'johnny45';
      const userToValidate = utils.createUser({ fbId: fbId });
      await utils.addUser(userToValidate);
      try {
        await utils.addUser(userToValidate);
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});
