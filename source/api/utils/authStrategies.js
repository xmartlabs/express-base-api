const appConfig = require('config');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');

exports.createAuthJWT = (passport) => {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({
                where: {
                    username: username,
                    active: true
                }
            })
                .then(result => {
                    const user = result.get({ plain: true });
                    if (user.password === password) { //Should use bcrypt
                        const payload = { id: user.id };
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
                    console.log(error);
                    return done(null, false, { message: "User does not exist" });
                });
        }
    ));
};

