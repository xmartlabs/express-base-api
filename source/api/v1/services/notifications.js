const notifier = require('../../../services/notifications')();

module.exports = (router) => {
  router.post('/services/notify', async (req, res, next) => {
    try {
      return await notifier.send(req.body);
    } catch (error) {
      return next(error);
    }
  });
};
