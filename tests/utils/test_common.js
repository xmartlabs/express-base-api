const chai = require('chai');
const common = require('../../source/utils/common');

const expect = chai.expect;

describe('Is Empty Or White Space', function () {
  describe('Is Empty Or White Space - Correct String', function () {
    it('should return true because string is correct', function () {
      const str = 'word';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(str);
      expect(isEmptyOrWhiteSpace).to.be.equal(false);
    });
  });

  describe('Is Empty Or White Space - Null String', function () {
    it('should return false because string is null', function () {
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(null);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });

  describe('Is Empty Or White Space - Empty String', function () {
    it('should return false because string is empty', function () {
      const emptyString = '';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(emptyString);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });

  describe('Is Empty Or White Space - White Space String', function () {
    it('should return false because string is white spaces', function () {
      const whiteSpaceString = '     ';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(whiteSpaceString);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });
});
