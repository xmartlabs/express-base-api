const mocha = require('mocha');
const expect = require('chai').expect;

mocha.describe('Test environment', function () {
  mocha.it('is OK', function () {
    expect(true).to.equal(true);
  });
});
