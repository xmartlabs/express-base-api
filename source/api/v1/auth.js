const appConfig = require('config');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const { User } = require('../../models');

module.exports = (router, passport) => {
 
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({
                where: {
                    username: username,
                    active: true
                },
                attributes: User.secureAttributes()
            })
                .then(user => {
                    if (user.password === req.body.password) { //Should use bcrypt
                        var payload = { id: user.id };
                        var token = jwt.sign(payload, appConfig.get('SECRET_KEY'));
                        res.json({
                            status: "success",
                            message: "Successfully logged in.",
                            token: token
                        });
                    } else {
                        res.status(401).json({ message: "Invalid payload." });
                    }
                })
                .catch(error => {
                    res.status(401).json({ message: "User does not exist" });
                });
        }
    ));

    router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

};