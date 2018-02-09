const JwtStrategy = require('./jwtStrategy');
const LocalStrategy = require('./localStrategy');

exports.createAuthStrategies = (passport) => {
  passport.use(LocalStrategy());
  passport.use(JwtStrategy());
};
