const common = require('../utils/common');
const { Device } = require('../models');
const { MissingDataException, NotFoundException, RepeatedObjectException, ServerErrorException } = require('../errors');
const userDAO = require('./userDAO');

exports.addDevice = async (device) => {
  this._validateEmptyDeviceFields(device);
  await this._validateRepeatedDevice(device);
  try {
    const createdDevice = await Device.create(device);
    return createdDevice.get({ plain: true });
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports.changeUserfromDevice = async (deviceId, userId) => {
  let device;
  let deviceChanged = false;
  await userDAO.getUserById(userId);
  await this.getDeviceById(deviceId);
  try {
    device = await Device.update(
      { userId: userId },
      { where: { deviceId: deviceId, active: true } });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (device[0] === 1) deviceChanged = true;
  return deviceChanged;
};

exports.getDeviceById = async (deviceId) => {
  let device;
  try {
    device = await Device.findOne({
      where: { deviceId: deviceId }
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (!device) throw new NotFoundException('Device does not exist');
  return device.get({ plain: true });
}

exports._validateEmptyDeviceFields = (device) => {
  if (!device || common.isEmptyOrWhiteSpace(device.deviceId) || common.isEmptyOrWhiteSpace(device.deviceType)
    || common.isEmptyOrWhiteSpace(device.pnToken)) {
    throw new MissingDataException('Missing data from device');
  }
};

exports._validateRepeatedDevice = async (device) => {
  let deviceFound;
  try {
    deviceFound = await Device.findOne({
      where: {
        $or: [{ deviceId: device.deviceId }, { pnToken: device.pnToken }],
        active: true
      }
    });
  } catch (error) {
    throw new ServerErrorException();
  }
  if (deviceFound) throw new RepeatedObjectException('Device with repeated credentials');
};
