const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const mocha = require('mocha');
const { User } = require('../source/models');

mocha.before(function () {
  chai.use(sinonChai);
});

mocha.beforeEach(async function () {
  this.sandbox = sinon.sandbox.create();
  await User.destroy({
    where: {}
  });
});

mocha.afterEach(function () {
  this.sandbox.restore();
});
