const userDAO = require('../../dao/userDAO')

module.exports = (router, passport) => {

  router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, token, data) => {
      if (err) return next(err);
      if (!token) return res.status(400).json(data);
      return res.json(token);
    })(req, res, next);
  });

  router.get('/auth/logout', (req, res) => {
    req.logout(); //NOTE: The docs dont state that this throws an exception
    return res.json({ message: 'Successfully logged out' });
  });

  router.post('/auth/register', async (req, res, next) => {
    try {
      const user = { ...req.body };
      userDAO.validateEmptyUserFields(user);
      await userDAO.validateRepeatedUser(user);
      await userDAO.addUser(user);

      //Login
      passport.authenticate('local', { session: false }, (error, token, data) => {
        if (error) return next(error);
        if (!token) return res.status(400).json(data);
        return res.json(token);
      })(req, res, next);

    }
    catch (error) {
      next(error);
    };
  });

};
