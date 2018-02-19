const chai = require('chai');
const mocha = require('mocha');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { User, Device } = require('../source/models');

mocha.before(function () {
  chai.use(sinonChai);
});

mocha.beforeEach(async function () {
  this.sandbox = sinon.sandbox.create();
  await Device.destroy({
    where: {}
  });
  await User.destroy({
    where: {}
  });
});

mocha.afterEach(function () {
  this.sandbox.restore();
});
