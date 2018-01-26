const appConfig = require('config');
const authStrategies = require('../utils/authStrategies');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const { User } = require('../../models');

module.exports = (passport) => {

    const jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = appConfig.get('secretKey');

    const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
        console.log('payload received', jwt_payload);
        // usually this would be a database call:
        var user = User.findById(jwt_payload.id);
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });

    passport.use(strategy);

};