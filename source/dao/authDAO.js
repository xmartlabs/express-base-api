const encryption = require('../../source/utils/encryption');
const common = require('../../source/utils/common');
const { MissingDataException, NotFoundException, RepeatedObjectException, ServerErrorException } = require('../errors');
const { User } = require('../models');
const userDAO = require('./userDAO');

exports.passwordChange = async (userId, passwords) => {
  let user;
  let obtainedUser;
  let oldPasswordCorrect = true;
  if(common.isEmptyOrWhiteSpace(passwords.newPassword)) return false;
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

  if (!oldPasswordCorrect) return false;
  if (user[0] === 1) return true;
  return false;
};
