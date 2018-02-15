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

};
