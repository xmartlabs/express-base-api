const appConfig = require('config');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const { User } = require('../../models');

exports.createAuthentificationJWT = (passport) => {

    const jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = appConfig.get('secretKey');

    passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
        console.log(jwt_payload)

        User.findById(jwt_payload.id)
        .then(result => {
            const user = result.get({ plain: true });
            return done(null, user);
        })
        .catch(error => {
            return done(null, false, { message: "User not logged" });
        });
    }));

};