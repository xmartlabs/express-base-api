const userDAO = require('../../../dao/userDAO');
const userSerializer = require('../../v1/user/userSerializer');

module.exports = (router, passport) => {

  router.get('/users', async (req, res, next) => {
    try {
      let users = await userDAO.getAllUsers();
      users = userSerializer.serializeList(users);
      return res.json(users);
    } catch (error) {
      next(error);
    }
  });

  router.get('/users/:username', async (req, res, next) => {
    try {
      let user = await userDAO.getUserByUsername(req.params.username);
      user = userSerializer.serialize(user);
      return res.json(user);
    } catch (error) {
      next(error);
    };
  });

  router.post('/users', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (error, user) => { //TODO: check for admin role
      //Checks for authentication
      if (error) return next(error);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      try {
        let userAdded = await userDAO.addUser(req.body);
        userAdded = userSerializer.serialize(userAdded);
        return res.json(userAdded);
      }
      catch (error) {
        return next(error);
      };
    })(req, res, next);
  });
}
