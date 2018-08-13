const encryption = require('../api/utils/encryption');
const queryWrapper = require('./queryWrapper.js').exceptionWrapper;
const { MissingDataException, NotFoundException, RepeatedObjectException, ServerErrorException } = require('../errors');
const { User } = require('../models');


const _addUser = async (user) => { //TODO: validate password with passwordValidator.js
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

module.exports = {
    addUser:            queryWrapper (_addUser),
    getAllUsers:        queryWrapper (_getAllUsers),
    getUserById:        queryWrapper (_getUserById),
    getUserByUsername:  queryWrapper (_getUserByUsername),
}




