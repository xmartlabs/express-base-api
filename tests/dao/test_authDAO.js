const authDAO = require('../../source/dao/authDAO');
const chai = require('chai');
const { MissingDataException, NotFoundException, UnauthorizedException } = require('../../source/errors');
const userDAO = require('../../source/dao/userDAO');
const utils = require('../utils');

const expect = chai.expect;

describe('Password Change', function () {
  describe('Password Change', function () {
    it('should change the password of the user', async function () {
      const user = await utils.addUser({ password: 'Password' });
      const passwords = {
        oldPassword: 'Password',
        newPassword: 'Password01',
      };
      const passwordChanged = await authDAO.passwordChange(user.id, passwords);

      expect(passwordChanged).to.be.equal(true);
    });
  });

  describe('Password Change - User Id incorrect', function () {
    it('should throw exception userId is incorrect', async function () {
      let throwsError = false;
      const passwords = {
        oldPassword: 'Password',
        newPassword: 'Password01',
      };
      try {
        await authDAO.passwordChange('2', passwords);
      } catch (error) {
        if (error instanceof NotFoundException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Password Change - OldPassword incorrect', function () {
    it('should throw exception beacuse the oldPassword is incorrect', async function () {
      let throwsError = false;
      const user = await utils.addUser({ password: 'Password23' });
      const passwords = {
        oldPassword: 'Password',
        newPassword: 'Password01',
      };
      try {
        await authDAO.passwordChange(user.id, passwords);
      } catch (error) {
        if (error instanceof UnauthorizedException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });

  describe('Password Change - Empty NewPassword', function () {
    it('should throw exception beacuse the newPassword is empty', async function () {
      let throwsError = false;
      const user = await utils.addUser({ password: 'Password' });
      const passwords = {
        oldPassword: 'Password',
        newPassword: '',
      };
      try {
        await authDAO.passwordChange(user.id, passwords);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(true);
    });
  });
});
