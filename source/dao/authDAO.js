const encryption = require('../../source/utils/encryption');
const passwordValidator = require('../../source/utils/passwordValidator');
const { MissingDataException, ServerErrorException, UnauthorizedException } = require('../errors');
const { User } = require('../models');
const userDAO = require('./userDAO');

exports.passwordChange = async (userId, passwords) => {
  if (!passwords.newPassword || !passwords.oldPassword) {
    throw new MissingDataException('Old password or new password are missing.');
  }
  passwordValidator.throwExceptionIfNotValidPassword(passwords.newPassword);
  const user = await userDAO.getUserById(userId);
  if (!encryption.compare(passwords.oldPassword, user.password)) {
    throw new UnauthorizedException('The current password did not match');
  }
  try {
    const hashedPassword = encryption.getHash(passwords.newPassword);
    const updates = await User.update(
      { password: hashedPassword },
      { where: { id: userId, active: true } });
    return updates[0] === 1;
  } catch (error) {
    throw new ServerErrorException();
  }
};
