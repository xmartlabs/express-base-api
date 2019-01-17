const notifier = require('../../../services/notifications')();

module.exports = (router, passport) => {
  router.post('/services/notify', async (req, res, next) => {
    try {
      return await notifier.send(req.body);
    } catch (error) {
      next(error);
    };
  });
}