const deviceDAO = require('../../../dao/deviceDAO');

module.exports = (router, passport) => {

  router.post('/devices', async (req, res, next) => {
    try {
      deviceDAO.validateEmptyDeviceFields(req.body);
      await deviceDAO.validateRepeatedDevice(req.body);
      let device = await deviceDAO.addDevice(req.body);
      return res.json(device);
    } catch (error) {
      next(error);
    }
  });

};
