const randomNumberDAO = require('../../dao/randomNumberDAO');
const { UnauthorizedException } = require('../../errors');
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

  router.post('/auth/password_recovery', async (req, res, next) => {
    //Creates a random number combination and sends an email to the user
    try {
      //Creates random combination
      const number = await randomNumberDAO.getNextNumber();
      await userDAO.passwordRecoveryCodeChange(req.body.email, number);

      //TODO: Sends email (nodemailer)

      return res.json({ message: 'Successful recovery' });

    } catch (error) {
      next(error);
    }
  });

  router.post('/auth/password', async (req, res, next) => {
    //Reset user password
    try {
      const passwordChanged = await userDAO.passwordChangeByRecoveryCode(req.body.recoveryCode, req.body.password);
      //TODO: go find the user

      return res.json({ message: '' });
    } catch (error) {
      next(error);
    }
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
