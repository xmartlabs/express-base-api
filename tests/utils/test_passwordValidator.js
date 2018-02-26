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

  //FIX ME: should I make stubs for all the wrong cases? (make sure Im calling the validator)
});