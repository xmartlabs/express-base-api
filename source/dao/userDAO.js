const MissingDataException = require('../errors/MissingDataException');
const NotFoundException = require('../errors/NotFoundException');
const RepeatedObjectException = require('../errors/RepeatedObjectException');
const ServerErrorException = require('../errors/ServerErrorException');
const { User } = require('../models');

exports.addUser = async (user) => {
  try {
    const createdUser = await User.create(user);
    return createdUser;
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports.getAllUsers = () => {
  return User.findAll()
    .then((users) => {
      return users; //FIXME: serialize users
    })
    .catch(error => {
      throw new ServerErrorException();
    });
};

exports.getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({
      where: {
        username: username,
        active: true
      },
      attributes: User.secureAttributes()
    })
    if (!user) throw new NotFoundException();
    return User.serialize(user);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException('User does not exist');
    }
    throw new ServerErrorException();
  }
};

exports.validateEmptyUserFields = (user) => {
  if (!user || !user.username || !user.email || !user.fbId || !user.password) {
    throw new MissingDataException('Missing data from user');
  }
};

exports.validateRepeatedUser = async (user) => {
  try {
    const userFound = await User.findOne({
      where: {
        $or: [{ username: user.username }, { email: user.email }, { fbId: user.fbId }],
        active: true
      },
      attributes: User.secureAttributes()
    });
    if (userFound) throw new RepeatedObjectException();
  } catch (error) {
    if (error instanceof RepeatedObjectException) {
      throw new RepeatedObjectException('User with repeated credentials');
    }
    throw new ServerErrorException();
  }
};
