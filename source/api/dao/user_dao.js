const NotFoundException = require('../errors/NotFoundException');
const ServerErrorException = require('../errors/ServerErrorException');
const { User } = require('../../models');

exports.getAllUsers = () => {
  return User.findAll()
    .then((users) => {
      return users; //FIX ME: serialize users
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
