const chai = require('chai');
const common = require('../../source/utils/common');

const expect = chai.expect;

describe('Is Empty Or White Space', function () {
  describe('Is Empty Or White Space - Correct String', function () {
    it('should return false because string (hello world) is correct', function () {
      const str = 'hello world';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(str);
      expect(isEmptyOrWhiteSpace).to.be.equal(false);
    });
  });

  describe('Is Empty Or White Space - String With White Spaces', function () {
    it('should return false because string ( hello ) is correct', function () {
      const str = ' hello ';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(str);
      expect(isEmptyOrWhiteSpace).to.be.equal(false);
    });
  });

  describe('Is Empty Or White Space - String With Breakline and Tab', function () {
    it('should return false because string with breakline and tab is correct', function () {
      const str = '\thello word\n';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(str);
      expect(isEmptyOrWhiteSpace).to.be.equal(false);
    });
  });

  describe('Is Empty Or White Space - Null String', function () {
    it('should return true because string is null', function () {
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(null);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });

  describe('Is Empty Or White Space - Empty String', function () {
    it('should return true because string is empty', function () {
      const emptyString = '';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(emptyString);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });

  describe('Is Empty Or White Space - White Space String', function () {
    it('should return true because string is white spaces', function () {
      const whiteSpaceString = '     ';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(whiteSpaceString);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });

  describe('Is Empty Or White Space - String Breakline', function () {
    it('should return true because string is a breakline', function () {
      const str = '\n';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(str);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });

  describe('Is Empty Or White Space - String Tab', function () {
    it('should return true because string is a tab', function () {
      const str = '\t';
      const isEmptyOrWhiteSpace = common.isEmptyOrWhiteSpace(str);
      expect(isEmptyOrWhiteSpace).to.be.equal(true);
    });
  });
});

describe('Has Number', function () {
  describe('Has Number - Correct String With Lowercase', function () {
    it('should return true because string (a1b) has a number', function () {
      const str = 'a1b';
      const isAlphanumeric = common.hasNumber(str);
      expect(isAlphanumeric).to.be.equal(true);
    });
  });

  describe('Has Number - Correct String With Uppercase', function () {
    it('should return true because string (A1B) has a number', function () {
      const str = 'A1B';
      const isAlphanumeric = common.hasNumber(str);
      expect(isAlphanumeric).to.be.equal(true);
    });
  });

  describe('Has Number - Correct String With Symbols', function () {
    it('should return true because string (12.!) has numbers', function () {
      const str = '12.!';
      const isAlphanumeric = common.hasNumber(str);
      expect(isAlphanumeric).to.be.equal(true);
    });
  });

  describe('Has Number - Only Numbers', function () {
    it('should return true because string has only numbers', function () {
      const str = '12345';
      const isAlphanumeric = common.hasNumber(str);
      expect(isAlphanumeric).to.be.equal(true);
    });
  });

  describe('Has Number - Only Letters', function () {
    it('should return false because string has only letters', function () {
      const str = 'hello WORLD';
      const isNumber = common.hasNumber(str);
      expect(isNumber).to.be.equal(false);
    });
  });
});

describe('Has Lower Case', function () {
  describe('Has Lower Case - Correct String', function () {
    it('should return true because string (124hello) has a letter in lowercase', function () {
      const str = '124hello';
      const isLowerCase = common.hasLowerCase(str);
      expect(isLowerCase).to.be.equal(true);
    });
  });

  describe('Has Lower Case - Correct String With Symbols', function () {
    it('should return true because string has a letter in lowercase with symbols', function () {
      const str = 'a.!';
      const isLowerCase = common.hasLowerCase(str);
      expect(isLowerCase).to.be.equal(true);
    });
  });

  describe('Has Lower Case - Only Letters Lowercase', function () {
    it('should return true because string has all letters in lowercase', function () {
      const str = 'hello world';
      const isLowerCase = common.hasLowerCase(str);
      expect(isLowerCase).to.be.equal(true);
    });
  });

  describe('Has Lower Case - Only Letters Uppercase', function () {
    it('should return false because string has only letters in uppercase', function () {
      const str = 'HELLO WORLD';
      const isLowerCase = common.hasLowerCase(str);
      expect(isLowerCase).to.be.equal(false);
    });
  });

  describe('Has Lower Case - Only Numbers', function () {
    it('should return false because string has only numbers', function () {
      const str = '1234';
      const isLowerCase = common.hasLowerCase(str);
      expect(isLowerCase).to.be.equal(false);
    });
  });
});

describe('Has Upper Case', function () {
  describe('Has Upper Case- Correct String', function () {
    it('should return true because string (124C) has a letter in uppercase', function () {
      const str = '124C';
      const isUpperCase = common.hasUpperCase(str);
      expect(isUpperCase).to.be.equal(true);
    });
  });

  describe('Has Upper Case - Correct String With Symbols', function () {
    it('should return true because string has a letter in uppercase with symbols', function () {
      const str = 'A.!';
      const isUpperCase = common.hasUpperCase(str);
      expect(isUpperCase).to.be.equal(true);
    });
  });

  describe('Has Upper Case - Only Letters Uppercase', function () {
    it('should return true because string has all letters in uppercase', function () {
      const str = 'HELLO WORLD';
      const isUpperCase = common.hasUpperCase(str);
      expect(isUpperCase).to.be.equal(true);
    });
  });

  describe('Has Upper Case- Only Letters Lowercase', function () {
    it('should return false because string has only letters in lowercase', function () {
      const str = 'hello world';
      const isUpperCase = common.hasUpperCase(str);
      expect(isUpperCase).to.be.equal(false);
    });
  });

  describe('Has Upper Case - Only Numbers', function () {
    it('should return false because string has only numbers', function () {
      const str = '1234';
      const isUpperCase = common.hasUpperCase(str);
      expect(isUpperCase).to.be.equal(false);
    });
  });
});

describe('Is Six Characters or Longer', function () {
  describe('Is Six Characters or Longer - Six', function () {
    it('should return true because string has six characters', function () {
      const str = '123456';
      const isSixCharactersOrLonger = common.isSixCharactersOrLonger(str);
      expect(isSixCharactersOrLonger).to.be.equal(true);
    });
  });

  describe('Is Six Characters or Longer - Nine', function () {
    it('should return true because string has nine characters', function () {
      const str = '123456789';
      const isSixCharactersOrLonger = common.isSixCharactersOrLonger(str);
      expect(isSixCharactersOrLonger).to.be.equal(true);
    });
  });

  describe('Is Six Characters or Longer - Five', function () {
    it('should return false because string has five characters', function () {
      const str = '12345';
      const isSixCharactersOrLonger = common.isSixCharactersOrLonger(str);
      expect(isSixCharactersOrLonger).to.be.equal(false);
    });
  });

  describe('Is Six Characters or Longer - Zero', function () {
    it('should return false because string has no characters', function () {
      const str = '';
      const isSixCharactersOrLonger = common.isSixCharactersOrLonger(str);
      expect(isSixCharactersOrLonger).to.be.equal(false);
    });
  });
});
