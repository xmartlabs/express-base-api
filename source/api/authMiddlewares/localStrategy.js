const LocalStrategy = require('passport-local').Strategy;

const encryption = require('../../utils/encryption');
const jwtTokenGenerator = require('./jwtTokenGenerator');
const userDAO = require('../../dao/userDAO');

module.exports = () => (new LocalStrategy(async (username, password, done) => {
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
    }
    return done(null, false, 'Forbidden');
  } catch (error) {
    return done(null, false, 'Forbidden');
  }
}));
