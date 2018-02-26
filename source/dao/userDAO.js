const appConfig = require('config');
const encryption = require('../api/utils/encryption');
const { MissingDataException, NotFoundException, RepeatedObjectException, ServerErrorException } = require('../errors');
const { User } = require('../models');

exports.addUser = async (user) => {
  this._validateEmptyUserFields(user);
  await this._validateRepeatedUser(user);
  try {
    const hashedPassword = encryption.getHash(user.password);
    user.password = hashedPassword;
    const createdUser = await User.create(user);
    return createdUser.get({ plain: true });
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.findAll({ raw: true });
    return users;
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports.getUserById = async (id) => {
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!user) throw new NotFoundException('User does not exist');
  return user.get({ plain: true });
};

exports.getUserByUsername = async (username) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        username: username,
        active: true
      }
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!user) throw new NotFoundException('User does not exist');
  return user.get({ plain: true });
};

exports._validateEmptyUserFields = (user) => {
  if (!user || !user.username || !user.email || !user.fbId || !user.password) {
    throw new MissingDataException('Missing data from user');
  }
};

exports._validateRepeatedUser = async (user) => {
  let userFound;
  try {
    userFound = await User.findOne({
      where: {
        $or: [{ username: user.username }, { email: user.email }, { fbId: user.fbId }],
        active: true
      }
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (userFound) throw new RepeatedObjectException('User with repeated credentials');
};

//FIXME: this method should be in authDAO
exports.passwordRecoveryCodeChange = async (email, recoveryCode) => {
  let user;
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + appConfig.get('passwordCodeExpirationMinutes')); //FIXME: use moment library
  try {
    user = await User.update(
      {
        passwordValidationCode: recoveryCode,
        passwordValidationCodeExpiration: expirationDate
      },
      { where: { email: email, active: true } });
  } catch (error) {
    throw new ServerErrorException();
  }
  return user[0] === 1;
};

exports.passwordChangeByRecoveryCode = async (recoveryCode, password) => {
  let user;
  const userObtained = await this._existsRecoveryCode(recoveryCode);
  try {
    const hashedPassword = encryption.getHash(password);
    user = await User.update({ password: hashedPassword },
      { where: { id: userObtained.id, active: true } });
  } catch (error) {
    throw new ServerErrorException();
  }
  return user[0] === 1;
};

exports._existsRecoveryCode = async (code) => {
  //Checks if the recovery code exists. If it does, it returns the user associated
  let user;
  const now = new Date();
  try {
    user = await User.findOne({
      where: {
        $and: [{ passwordValidationCodeExpiration: { $gte: now } }, { passwordValidationCode: code }]
      }
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!user) throw new NotFoundException('Incorrect recovery code');
  return user.get({ plain: true });
}
