const authStrategies = require('../utils/authStrategies');
const { User } = require('../../models');

module.exports = (router, passport) => {

  router.post('/v1/auth/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user, data) {
      if (err) return next(err);
      if (!user) return res.status(400).json(data);
      return res.json(user);
    })(req, res, next);
  });

  router.post('/v1/auth/register', async function (req, res, next) {
    try {
      //Checks if the user has empty fields
      if(!req.body || !req.body.username || !req.body.email || !req.body.fbId || !req.body.password) {
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

      //Login
      passport.authenticate('local', { session: false }, function (err, user, data) {
        if (err) return next(err);
        if (!user) return res.status(400).json(data);
        return res.json(user);
      })(req, res, next);

    }
    catch (error) {
      return res.status(500).json(error);
    };
  });

};
