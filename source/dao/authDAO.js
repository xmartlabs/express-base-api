const encryption = require('../../source/utils/encryption');
const common = require('../../source/utils/common');
const { MissingDataException, ServerErrorException, UnauthorizedException } = require('../errors');
const { User } = require('../models');
const userDAO = require('./userDAO');

exports.passwordChange = async (userId, passwords) => {
  let user;
  let obtainedUser;
  let oldPasswordCorrect = true;
  if(common.isEmptyOrWhiteSpace(passwords.newPassword)) throw new MissingDataException('The new password can not be empty');
  obtainedUser = await userDAO.getUserById(userId);
  try {
    if (encryption.compare(passwords.oldPassword, obtainedUser.password)) {
      user = await User.update(
        { password: passwords.newPassword },
        { where: { id: userId, active: true } });
    } else {
      oldPasswordCorrect = false;
    }
  } catch (error) {
    throw new ServerErrorException();
  }

  if (!oldPasswordCorrect) throw new UnauthorizedException('The current password did not match');
  if (user[0] === 1) return true;
  return false;
};
