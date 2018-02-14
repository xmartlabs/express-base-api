const deviceDAO = require('../../../dao/deviceDAO');

module.exports = (router, passport) => {

  router.post('/devices', async (req, res, next) => {
    try {
      let device = await deviceDAO.addDevice(req.body);
      return res.json(device);
    } catch (error) {
      next(error);
    }
  });

  router.put('/devices/:id', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (error, user) => {
      //Checks for authentication
      if (error) return next(error);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      try {
        const changed = await deviceDAO.changeUserfromDevice(req.params.id, user.id);
        // userDAO.validateEmptyUserFields(req.body)
        // await userDAO.validateRepeatedUser(req.body);
        // let user = await userDAO.addUser(req.body);
        // user = userSerializer.serialize(user);
        return res.json(user);
      }
      catch (error) {
        return next(error);
      };
    })(req, res, next);
  });

};
