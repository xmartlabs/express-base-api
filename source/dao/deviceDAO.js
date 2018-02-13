const { Device } = require('../models');
const MissingDataException = require('../errors/MissingDataException');
const RepeatedObjectException = require('../errors/RepeatedObjectException');
const ServerErrorException = require('../errors/ServerErrorException');

exports.addDevice = async (device) => {
  try {
    const createdDevice = await Device.create(device);
    return createdDevice.get({ plain: true });
  } catch (error) {
    throw new ServerErrorException();
  }
};

exports.validateEmptyDeviceFields = (device) => {
  if (!device || !device.deviceId || !device.deviceType || !device.pnToken) {
    throw new MissingDataException('Missing data from device');
  }
};

exports.validateRepeatedDevice = async (device) => {
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
