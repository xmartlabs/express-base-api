const authenticate = require('../../../api/utils/authenticate');
const { User } = require('../../../models');
const userDAO = require('../../../dao/userDAO');

module.exports = (router, passport) => {

  router.get('/v1/users', async (req, res, next) => {
    try {
      const users = await userDAO.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  });

  router.get('/v1/users/:username', async (req, res, next) => {
    try {
      const user = await userDAO.getUserByUsername(req.params.username);
      return res.json(user);
    } catch (error) {
      next(error);
    };
  });

  router.post('/v1/users', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      //Checks for authentication
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'User not logged' });

      try {
        userDAO.validateEmptyUserFields(req.body)
        await userDAO.validateRepeatedUser(req.body);
        const user = await userDAO.addUser(req.body);
        return res.json(user);
      }
      catch (error) {
        return next(error);
      };

    })(req, res, next);
  });
}
