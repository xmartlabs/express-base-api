const encryption = require('../api/utils/encryption');
const MissingDataException = require('../errors/MissingDataException');
const NotFoundException = require('../errors/NotFoundException');
const RepeatedObjectException = require('../errors/RepeatedObjectException');
const ServerErrorException = require('../errors/ServerErrorException');
const { User } = require('../models');

exports.addUser = async (user) => {
  try {
    const hashedPassword = encryption.getHash(user.password);
    user['password'] = hashedPassword;
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

exports.validateEmptyUserFields = (user) => {
  if (!user || !user.username || !user.email || !user.fbId || !user.password) {
    throw new MissingDataException('Missing data from user');
  }
};

exports.validateRepeatedUser = async (user) => {
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
