const authStrategies = require('../../api/utils/authStrategies');
const { User } = require('../../models');
const userDAO = require('../../dao/userDAO')

module.exports = (router, passport) => {

  router.post('/v1/auth/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, token, data) => {
      if (err) return next(err);
      if (!token) return res.status(400).json(data);
      return res.json(token);
    })(req, res, next);
  });

  router.post('/v1/auth/register', async (req, res, next) => {
    try {
      const user = { ...req.body };
      userDAO.validateEmptyUserFields(user);
      await userDAO.validateRepeatedUser(user);
      await userDAO.addUser(user);

      //Login
      passport.authenticate('local', { session: false }, (err, token, data) => {
        if (err) return next(err);
        if (!token) return res.status(400).json(data);
        return res.json(token);
      })(req, res, next);

    }
    catch (error) {
      next(error);
    };
  });

};
