const chai = require('chai');
const { MissingDataException } = require('../../source/errors');
const passwordValidator = require('../../source/utils/passwordValidator');

const expect = chai.expect;

describe('Validate Strong Password', function () {
  describe('Validate Strong Password', function () {
    it('should not throw error because password is strong', function () {
      let throwsError = false;
      const password = 'Password01';
      try {
        passwordValidator.validateStrongPassword(password);
      } catch (error) {
        if (error instanceof MissingDataException) throwsError = true;
      }
      expect(throwsError).to.equal(false);
    });
  });

  //TODO: make stubs for all the incorrect cases to make sure the common methods are been called
});
