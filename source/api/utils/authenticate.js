const appConfig = require('config');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const { User } = require('../../models');

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = appConfig.get('secretKey');

  exports.createAuthentificationJWT = (passport) => {
  passport.use(new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    if (!jwt_payload) {
      return done(null, false);
    }
    try {
      const result = await User.findById(jwt_payload.sub)
      const now = new Date().getTime()
      if(jwt_payload.exp < now) return done(null, false);
      const user = result.get({ plain: true });
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));

};
