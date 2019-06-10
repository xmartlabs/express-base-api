const appConfig = require('config');
const jwt = require('jsonwebtoken');

//TODO: Add roles and permissions within the jwt?
module.exports = (userId) => {
  const now = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + appConfig.get('tokenExpirationDays'));
  expirationDate.setSeconds(expirationDate.getSeconds() + appConfig.get('tokenExpirationSeconds'));
  const payload = {
    sub: userId,
    iat: now.getTime(),
    exp: expirationDate.getTime(),
  };
  const token = jwt.sign(payload, appConfig.get('secretKey'));
  return token;
};
