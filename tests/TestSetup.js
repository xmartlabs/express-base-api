const chai = require('chai');
const mocha = require('mocha');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { User, Device } = require('../source/models');

mocha.before(() => {
  chai.use(sinonChai);
});

mocha.beforeEach(async () => {
  this.sandbox = sinon.sandbox.create();
  await Device.destroy({
    where: {}
  });
  await User.destroy({
    where: {}
  });
});

mocha.afterEach(() => {
  this.sandbox.restore();
});
