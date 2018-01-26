const authStrategies = require('../utils/authStrategies');
const { User } = require('../../models');

module.exports = (router, passport) => {

    router.post('/login', function (req, res, next) {
        passport.authenticate('local', {session: false}, function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                return res.json(info); 
            }
            return res.json(user);
        })(req, res, next);
    });

};