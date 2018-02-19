const encryption = require('../utils/encryption');
const jwtTokenGenerator = require('./jwtTokenGenerator');
const LocalStrategy = require('passport-local').Strategy;
const userDAO = require('../../dao/userDAO');

module.exports = () => {
  return new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userDAO.getUserByUsername(username);
      if (encryption.compare(password, user.password)) {
        const token = jwtTokenGenerator(user.id);
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
