const authenticate = require('../../utils/authenticate');
const { User } = require('../../../models');
const user_dao = require('../../dao/user_dao');

module.exports = (router, passport) => {

  router.get('/v1/users', async (req, res) => {
    try {
      const users = await user_dao.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(error.status).json(error.name);
    }
  });

  router.get('/v1/users/:username', async (req, res) => {
    try {
      const user = await user_dao.getUserByUsername(req.params.username);
      return res.send(user);
    } catch (error) {
      console.log(error.message)
      return res.status(error.status).json(error.name);
    };
  });

  router.post('/v1/users', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
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
        return res.status(500).json({ message: 'Something went wrong.' });
      };

    })(req, res, next);
  });
}
