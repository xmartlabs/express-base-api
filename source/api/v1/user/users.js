const authenticate = require('../../utils/authenticate');
const { User } = require('../../../models');

module.exports = (router, passport) => {

    router.get('/users', function (req, res) {
        User.findAll()
            .then((users) => {
                res.json(users);
            })
            .catch(error => {
                res.json(error);
            });
    });

    router.get('/users_active', function (req, res) {
        User.findAll({
            where: {
                active: true
            }
        })
            .then((users) => {
                res.json(users);
            })
            .catch(error => {
                res.json(error);
            });
    });

    /*router.get('/users/:username', passport.authenticate('jwt', { session: false }),
        function (req, res) {
            User.findOne({
                where: {
                    username: req.params.username,
                    active: true
                },
                attributes: User.secureAttributes()
            })
                .then(user => {
                    const serializedUser = User.serialize(user);
                    res.send(serializedUser);
                })
                .catch(error => {
                    res.json(error);
                });
    });*/

    router.get('/users/:username', function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err) {
            if (err) { return next(err); }
            User.findOne({
                where: {
                    username: req.params.username,
                    active: true
                },
                attributes: User.secureAttributes()
            })
                .then(user => {
                    const serializedUser = User.serialize(user);
                    return res.send(serializedUser);
                })
                .catch(error => {
                    return res.json(error);
                });
        })(req, res, next);
    });

    router.post('/users', function (req, res) {
        User.create(req.body)
            .then((user) => {
                res.json(user);
            })
            .catch(error => {
                res.json(error);
            });
    });

};