const { Randomnumber } = require('../models');
const RandomNumberGenerator = require('../../source/api/utils/randomNumberGenerator');
const { ServerErrorException } = require('../errors');

exports.getNextNumber = async () => {
  try {
    const randomNumberGenerator = new RandomNumberGenerator();
    const prev = await this._getPreviousNumber();
    const next = randomNumberGenerator.next(prev);
    await this._saveRandomNumber(next);
    return next;
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports._getPreviousNumber = async () => {
  let prev;
  try {
    prev = await Randomnumber.findAll({
      raw: true,
      limit: 1,
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (prev.length === 0) {
    //If there is no previous number
    const randomNumberGenerator = new RandomNumberGenerator();
    return randomNumberGenerator.g;
  }
  return prev[0].lastNumber;
};

exports._saveRandomNumber = async (number) => {
  try {
    const randomNumber = { lastNumber: number };
    const createdNumber = await Randomnumber.create(randomNumber);
    return createdNumber.get({ plain: true });
  } catch (error) {
    throw new ServerErrorException();
  }
};
