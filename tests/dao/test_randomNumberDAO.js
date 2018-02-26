const chai = require('chai');
const randomNumberDAO = require('../../source/dao/randomNumberDAO');
const RandomNumberGenerator = require('../../source/api/utils/randomNumberGenerator');
const { ServerErrorException } = require('../../source/errors');
const utils = require('../utils');
const { savesRandomNumberStub } = require('../stubs');

const expect = chai.expect;

describe('Get Next Random Number', function () {
  describe('Get Next Random Number', function () {
    it('should return the next number', async function () {
      const number = 9;
      await randomNumberDAO._saveRandomNumber(number);
      const next = await randomNumberDAO.getNextNumber();
      expect(next).to.be.a('number');
      expect(next).to.not.be.equal(number);
    });
  });

  describe('Get Next Random Number - Saves Number', function () {
    it('should call the method to save the random number', async function () {
      const validatorStub = savesRandomNumberStub(this.sandbox);
      await randomNumberDAO.getNextNumber();
      expect(validatorStub).to.be.calledWith();
    });
  });
});

describe('Get Previous Random Number', function () {
  describe('Get Previous Random Number', function () {
    it('should return the previous number', async function () {
      const number = 9;
      await randomNumberDAO._saveRandomNumber(number);
      const prev = await randomNumberDAO._getPreviousNumber();
      expect(prev).to.be.a('number');
      expect(prev).to.be.equal(number);
    });
  });

  describe('Get Previous Random Number - No Previous Number', function () {
    it('should return the value declared in the g variable in the RandomNumberGenerator class', async function () {
      const prev = await randomNumberDAO._getPreviousNumber();
      const randomNumberGenerator = new RandomNumberGenerator();
      expect(prev).to.be.a('number');
      expect(prev).to.be.equal(randomNumberGenerator.g);
    });
  });
});

describe('Save Random Number', function () {
  it('should save the number', async function () {
    const number = 955;
    const numberSaved = await randomNumberDAO._saveRandomNumber(number);
    expect(numberSaved).to.be.an('object');
    expect(numberSaved).to.have.property('id');
    expect(numberSaved.lastNumber).to.be.a('number');
    expect(numberSaved.lastNumber).to.be.equal(number);
  });
});
