const appConfig = require('config');
const bcrypt = require('bcrypt');

exports.getHash = (plainText) => {
  let hashedText = bcrypt.hashSync(plainText, appConfig.get('bcryptLogRounds'));
  return hashedText;
};

exports.compare = (plainText, hashedText) => {
  return bcrypt.compareSync(plainText, hashedText);
};
