const authenticate = require('../../utils/authenticate');
const { User } = require('../../../models');

module.exports = (router, passport) => {

  router.get('/users', function (req, res) {
    User.findAll()
      .then((users) => {
        return res.json(users);
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  });

  router.get('/users/:username', async function (req, res) {
    try {
      const user = await User.findOne({
        where: {
          username: req.params.username,
          active: true
        },
        attributes: User.secureAttributes()
      })
      if (!user) return res.status(404).json({ message: 'User does not exist' });
      const serializedUser = User.serialize(user);
      return res.send(serializedUser);
    } catch (error) {
      return res.status(500).json(error);
    };
  });

  router.post('/users', function (req, res, next) {
    passport.authenticate('jwt', { session: false }, async function (err, user) {

      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'User not logged' });
      try {
        const userFound = await User.findOne({
          where: {
            $or: [{ username: req.body.username }, { email: req.body.email }, { fbId: req.body.fbId }],
            active: true
          },
          attributes: User.secureAttributes()
        });

        if (userFound) return res.status(400).json({ message: 'User with repeated credentials' });

        const user = await User.create(req.body);
        return res.json(user);
      }
      catch (error) {
        return res.status(500).json(error);
      };

    })(req, res, next);
  });
}
