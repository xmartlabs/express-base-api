const appConfig = require('config');
const encryption = require('../utils/encryption');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const userDAO = require('../../dao/userDAO');

module.exports = () => {
  return new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userDAO.getUserByUsername(username);
      if (encryption.compare(password, user.password)) {
        const now = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + appConfig.get('tokenExpirationDays'));
        expirationDate.setSeconds(expirationDate.getSeconds() + appConfig.get('tokenExpirationSeconds'));
        const payload = {
          sub: user.id,
          iat: now.getTime(),
          exp: expirationDate.getTime(),
        };
        const token = jwt.sign(payload, appConfig.get('secretKey'));
        const data = {
          status: 'success',
          message: 'Successfully logged in.',
          auth_token: token,
        };
        return done(null, data);
      } else {
        return done(null, false, { message: 'Forbidden' });
      }
    } catch (error) {
      return done(null, false, { message: 'Forbidden' });
    };
  }
  );
};
