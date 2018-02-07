const appConfig = require('config');
const encryption = require('./encryption');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
const userDAO = require('../../dao/userDAO');

exports.createAuthJWT = (passport) => {
  passport.use(new LocalStrategy(async (username, password, done) => {
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
          exp: expirationDate.getTime()
        };
        const token = jwt.sign(payload, appConfig.get('secretKey'));
        const data = {
          status: 'success',
          message: 'Successfully logged in.',
          auth_token: token
        };
        return done(null, data);
      } else {
        return done(null, false, { message: 'Invalid payload.' });
      }
    } catch (error) {
      return done(null, false, { message: 'User does not exist' });
    };
  }
  ));
};

