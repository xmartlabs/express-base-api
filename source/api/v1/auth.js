const authStrategies = require('../utils/authStrategies');
const { User } = require('../../models');

module.exports = (router, passport) => {

    router.post('/login', function (req, res, next) {
        passport.authenticate('local', { session: false }, function (err, user, data) {
            if (err) { return next(err); }
            return res.json(user || data);
        })(req, res, next);
    });

};