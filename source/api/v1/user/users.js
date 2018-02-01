const authenticate = require('../../utils/authenticate');
const { User } = require('../../../models');

module.exports = (router, passport) => {

  router.get('/v1/users', function (req, res) {
    User.findAll()
      .then((users) => {
        return res.json(users);
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  });

  router.get('/v1/users/:username', async function (req, res) {
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

  router.post('/v1/users', function (req, res, next) {
    passport.authenticate('jwt', { session: false }, async function (err, user) {
      //Checks for authentication
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'User not logged' });
      try {
        //Checks if the user has empty fields
        if (!req.body || !req.body.username || !req.body.email || !req.body.fbId || !req.body.password) {
          return res.status(400).json({ message: 'Missing data from user' });
        }
        //Checks for existing user
        const userFound = await User.findOne({
          where: {
            $or: [{ username: req.body.username }, { email: req.body.email }, { fbId: req.body.fbId }],
            active: true
          },
          attributes: User.secureAttributes()
        });
        if (userFound) return res.status(400).json({ message: 'User with repeated credentials' });

        //Creates the user
        const user = await User.create(req.body);
        return res.json(user);
      }
      catch (error) {
        return res.status(500).json(error);
      };

    })(req, res, next);
  });
}
