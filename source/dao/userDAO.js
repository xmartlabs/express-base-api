const encryption = require('./utils/encryption');
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
    return User.serialize(createdUser);
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return User.serialize(users);
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
      },
      attributes: User.secureAttributes()
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!user) throw new NotFoundException('User does not exist');
  return User.serialize(user);
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
      },
      attributes: User.secureAttributes()
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (userFound) throw new RepeatedObjectException('User with repeated credentials');
};
