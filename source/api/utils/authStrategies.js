const appConfig = require('config');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const moment = require('moment');
const { User } = require('../../models');

exports.createAuthJWT = (passport) => {
  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
      where: {
        username: username,
        active: true
      },
      attributes: ['username', 'password', 'id']
    })
      .then(result => {
        const user = result.get({ plain: true });
        if (user.password === password) { // FIXME: Should use bcrypt
          const now = new Date();
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + appConfig.get('tokenExpirationDays'));
          expirationDate.setSeconds(expirationDate.getSeconds() + appConfig.get('tokenExpirationSeconds'));
          const payload = {
            sub: user.id,
            iat: now.getTime(),
            exp: expirationDate.getTime()
          }
          const token = jwt.sign(payload, appConfig.get('secretKey'));
          const data = {
            status: 'success',
            message: 'Successfully logged in.',
            auth_token: token
          };
          return done(null, data);
        } else {
          return done(null, false, { message: "Invalid payload." });
        }
      })
      .catch(error => {
        return done(null, false, { message: "User does not exist" });
      });
  }
  ));
};

