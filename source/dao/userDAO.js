const queryWrapper = require('./queryWrapper.js').exceptionWrapper;
const encryption = require('../utils/encryption');
const passwordValidator = require('../../source/utils/passwordValidator');
const common = require('../utils/common');
const { MissingDataException, NotFoundException, RepeatedObjectException, ServerErrorException } = require('../errors');
const { User } = require('../models');

const _addUser = async (user) => { 
    passwordValidator.throwExceptionIfNotValidPassword(user.password);
    const hashedPassword = encryption.getHash(user.password);
    user.password = hashedPassword;
    const createdUser = await User.create(user);
    return createdUser.get({ plain: true });
}

const _getAllUsers = async () => {
  try {
    const users = await User.findAll({ raw: true });
    return users;
  } catch (error) {
    throw new ServerErrorException();
  }
};

const _getUserById = async (id) => {
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!user) throw new NotFoundException('User does not exist');
  return user.get({ plain: true });
};

const _getUserByUsername = async (username) => {
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

const _getUserByEmail = async (email) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        email: email
      }
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!user) throw new NotFoundException('User does not exist');
  return user.get({ plain: true });
};

module.exports = {
    addUser:            queryWrapper (_addUser),
    getAllUsers:        queryWrapper (_getAllUsers),
    getUserById:        queryWrapper (_getUserById),
    getUserByEmail:     queryWrapper (_getUserByEmail),
    getUserByUsername:  queryWrapper (_getUserByUsername),
}

exports._validateEmptyUserFields = (user) => {
  if (!user || common.isEmptyOrWhiteSpace(user.username) || common.isEmptyOrWhiteSpace(user.email)
    || common.isEmptyOrWhiteSpace(user.fbId) || common.isEmptyOrWhiteSpace(user.password)) {
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
