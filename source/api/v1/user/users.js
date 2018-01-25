const { User } = require('../../../models');

module.exports = (router) => {

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

    router.get('/users/:username', function (req, res) {
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