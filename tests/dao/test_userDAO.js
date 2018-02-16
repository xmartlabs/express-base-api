const app = require('../../index').app;
const chai = require('chai');
const encryption = require('../../source/api/utils/encryption');
const { MissingDataException, NotFoundException, RepeatedObjectException } = require('../../source/errors');
const sinon = require('sinon');
const sinonchai = require('sinon-chai');
const userDAO = require('../../source/dao/userDAO');
const utils = require('../utils');
const { validateRepeatedUserStub, validateEmptyUserFieldsStub } = require('../stubs');

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
      const password = 'Password';
      const userToAdd = utils.createUser({ password: password });
      const user = await userDAO.addUser(userToAdd);

      const isPasswordCorrect = encryption.compare(password, user.password);
      expect(user).to.be.an('object');
      expect(isPasswordCorrect).to.equal(true);
    });
  });

  describe('Add User - Validate Repeated User', function () {
    it('should call the validation method for repeated User', async function () {
      const user = utils.createUser();
      const validatorStub = validateRepeatedUserStub(this.sandbox);
      await userDAO.addUser(user);

      expect(validatorStub).to.be.calledWith(user);
    });
  });

  describe('Add User - Validate Empty Fields', function () {
    it('should call the validation method for empty User fields', async function () {
      const user = utils.createUser();
      const validatorStub = validateEmptyUserFieldsStub(this.sandbox);
      await userDAO.addUser(user);

      expect(validatorStub).to.be.calledWith(user);
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
        await userDAO.getUserByUsername('incorrect')
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
        userDAO._validateEmptyUserFields(user);
      } catch (error) {
        throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  describe('Validate Empty Fields of User - Null User', function () {
    it('should throw exception because user is null', async function () {
      let throwsError = false;
      try {
        userDAO._validateEmptyUserFields(null);
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
        userDAO._validateEmptyUserFields({});
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
        userDAO._validateEmptyUserFields(user);
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
        userDAO._validateEmptyUserFields(user);
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
        userDAO._validateEmptyUserFields(user);
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
        userDAO._validateEmptyUserFields(user);
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
      const user = utils.createUser();
      try {
        await userDAO._validateRepeatedUser(user)
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
      const user = await utils.addUser({ username: username });
      const userToValidate = utils.createUser({ username: username });
      try {
        await userDAO._validateRepeatedUser(userToValidate)
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
      const user = await utils.addUser({ email: email });
      const userToValidate = utils.createUser({ email: email });
      try {
        await userDAO._validateRepeatedUser(userToValidate)
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
      const user = await utils.addUser({ fbId: fbId });
      const userToValidate = utils.createUser({ fbId: fbId });
      try {
        await userDAO._validateRepeatedUser(userToValidate)
      } catch (error) {
        if (error instanceof RepeatedObjectException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});
