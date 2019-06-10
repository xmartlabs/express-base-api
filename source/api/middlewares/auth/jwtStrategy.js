const appConfig = require('config');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const userDAO = require('../../../dao/userDAO');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = appConfig.get('secretKey');

module.exports = () => {
  return new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    if (!jwtPayload) return done(null, false);
    try {
      const now = new Date().getTime();
      if (jwtPayload.exp < now) return done(null, false);
      const user = await userDAO.getUserById(jwtPayload.sub);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    };
  })
};
