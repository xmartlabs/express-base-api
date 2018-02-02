const mocha = require('mocha');
const expect = require('chai').expect;

mocha.describe('Test environment', () => {
  mocha.it('is OK', () => {
    expect(true).to.equal(true);
  });
});
