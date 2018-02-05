const authStrategies = require('../utils/authStrategies');
const { User } = require('../../models');
const userDAO = require('../../dao/userDAO')

module.exports = (router, passport) => {

  router.post('/v1/auth/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, data) => {
      if (err) return next(err);
      if (!user) return res.status(400).json(data);
      return res.json(user);
    })(req, res, next);
  });

  router.post('/v1/auth/register', async (req, res, next) => {
    try {
      userDAO.validateEmptyUserFields(req.body)
      await userDAO.validateRepeatedUser(req.body);

      const user = await User.create(req.body);

      //Login
      passport.authenticate('local', { session: false }, (err, user, data) => {
        if (err) return next(err);
        if (!user) return res.status(400).json(data);
        return res.json(user);
      })(req, res, next);

    }
    catch (error) {
      next(error);
    };
  });

};
