const authDAO = require('../../dao/authDAO');
const { ServerErrorException, UnauthorizedException } = require('../../errors');
const userDAO = require('../../dao/userDAO');

module.exports = (router, passport) => {

  router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, token, data) => {
      if (err) return next(err);
      if (!token) return next(new UnauthorizedException(data.message));
      return res.json(token);
    })(req, res, next);
  });

  router.get('/auth/logout', (req, res) => {
    req.logout(); //NOTE: The docs dont state that this throws an exception
    return res.json({ message: 'Successfully logged out' });
  });

  router.put('/auth/password_change', async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (error, user) => {
      //Checks for authentication
      if (error) return next(error);
      if (!user) return next(new UnauthorizedException());
      try {
        let changed = await authDAO.passwordChange(user.id, req.body);
        if (!changed) next(new ServerErrorException());
        const userChanged = await userDAO.getUserById(user.id);
        return res.json(userChanged);
      }
      catch (error) {
        return next(error);
      };
    })(req, res, next);
  });

  router.post('/auth/register', async (req, res, next) => {
    try {
      const user = { ...req.body };
      await userDAO.addUser(user);

      //Login
      passport.authenticate('local', { session: false }, (error, token, data) => {
        if (error) return next(error);
        if (!token) return next(new UnauthorizedException(data.message));
        return res.json(token);
      })(req, res, next);

    }
    catch (error) {
      next(error);
    };
  });

};
