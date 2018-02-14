const { Device } = require('../models');
const { MissingDataException, RepeatedObjectException, ServerErrorException } = require('../errors');

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
  let deviceChanged;
  try {
    deviceChanged = await Device.update(
      { user_id: userId },
      { where: { deviceId: device.deviceId, active: true } });
    return deviceChanged.get({ plain: true });
  } catch (error) {
    console.log(error)
    throw new ServerErrorException();
  }
};

exports._validateEmptyDeviceFields = (device) => {
  if (!device || !device.deviceId || !device.deviceType || !device.pnToken) {
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
