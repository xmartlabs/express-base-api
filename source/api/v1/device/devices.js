const deviceDAO = require('../../../dao/deviceDAO');
const { ServerErrorException, UnauthorizedException } = require('../../../errors');

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
      if (!user) return next(new UnauthorizedException());
      try {
        const changed = await deviceDAO.changeUserfromDevice(req.params.id, user.id);
        if (!changed) next(new ServerErrorException());
        const deviceUpdated = await deviceDAO.getDeviceById(req.params.id);
        return res.json(deviceUpdated);
      }
      catch (error) {
        return next(error);
      };
    })(req, res, next);
  });

};
