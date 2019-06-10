const appConfig = require('config');
const chai = require('chai');
const jwtTokenGenerator = require('../../source/api/middlewares/auth/jwtTokenGenerator');
const utils = require('../utils');

const expect = chai.expect;

describe('Create JWT Token', function () {
  describe('Create JWT Token - Verify payload object', function () {
    it('should create a payload with sub, iat and exp', function (done) {
      const userId = '1';
      const token = jwtTokenGenerator(userId);
      const decodedToken = utils.verifyJwtToken(token);

      expect(token).to.be.a('string');
      expect(token).not.to.be.empty;
      expect(decodedToken).to.have.property('sub');
      expect(decodedToken).to.have.property('iat');
      expect(decodedToken).to.have.property('exp');
      done();
    });
  });

  describe('Create JWT Token - Verify correct userId in payload', function () {
    it('should create a payload with the given userId', function (done) {
      const userId = '1';
      const token = jwtTokenGenerator(userId);
      const decodedToken = utils.verifyJwtToken(token);

      expect(token).to.be.a('string');
      expect(token).not.to.be.empty;
      expect(decodedToken.sub).to.be.equal(userId);
      done();
    });
  });

  describe('Create JWT Token - Verify correct expiration in payload', function () {
    it('should create a payload with correct expiration', function (done) {
      const userId = '1';
      const token = jwtTokenGenerator(userId);
      const decodedToken = utils.verifyJwtToken(token);

      const creation = new Date(decodedToken.iat);
      const expiration = new Date(decodedToken.exp);
      const calculatedCreation = new Date(expiration.setSeconds(expiration.getSeconds() - appConfig.get('tokenExpirationSeconds')));

      expect(token).to.be.a('string');
      expect(token).not.to.be.empty;
      expect(+creation).to.be.equal(+calculatedCreation);
      done();
    });
  });
});

