const appConfig = require('config');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const { User } = require('../../models');

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = appConfig.get('secretKey');

  exports.createAuthentificationJWT = (passport) => {
  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    if (!jwtPayload) {
      return done(null, false);
    };
    try {
      const userById = await User.findById(jwtPayload.sub)
      const now = new Date().getTime()
      if(jwtPayload.exp < now) return done(null, false);
      const user = userById.get({ plain: true });
      return done(null, user);
    } catch (err) {
      return done(err, false);
    };
  }));

};
