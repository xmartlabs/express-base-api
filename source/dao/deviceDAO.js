const { Device } = require('../models');
const { MissingDataException, NotFoundException, RepeatedObjectException, ServerErrorException } = require('../errors');
const queryWrapper = require('./queryWrapper.js').exceptionWrapper;
const userDAO = require('./userDAO');

const _addDevice = async (device) => {
  //this._validateEmptyDeviceFields(device);
  //await this._validateRepeatedDevice(device);
    const createdDevice = await Device.create(device);
    return createdDevice.get({ plain: true });
};

const _changeUserfromDevice = async (deviceId, userId) => {
  let device;
  let deviceChanged = false;
  await userDAO.getUserById(userId);
  await this.getDeviceById(deviceId);
    device = await Device.update(
      { userId: userId },
      { where: { deviceId: deviceId, active: true } });
  if (device[0] === 1) deviceChanged = true;
  return deviceChanged;
};

const _getDeviceById = async (deviceId) => {
  let device;
    device = await Device.findOne({
      where: { deviceId: deviceId }
    });
  if (!device) throw new NotFoundException('Device does not exist');
  return device.get({ plain: true });
}

const _getAllDevices = async () => {
    return await Device.findAll({ raw: true });
    if (!device) throw new NotFoundException('Device does not exist');
}

//exports._validateEmptyDeviceFields = (device) => {
//  if (!device || !device.deviceId || !device.deviceType || !device.pnToken) {
//    throw new MissingDataException('Missing data from device');
//  }
//};
//
//exports._validateRepeatedDevice = async (device) => {
//  let deviceFound;
//  try {
//    deviceFound = await Device.findOne({
//      where: {
//        $or: [{ deviceId: device.deviceId }, { pnToken: device.pnToken }],
//        active: true
//      }
//    });
//  } catch (error) {
//    throw new ServerErrorException();
//  }
//  if (deviceFound) throw new RepeatedObjectException('Device with repeated credentials');
//};


module.exports = {
    addDevice:            queryWrapper(_addDevice),
    changeUserfromDevice: queryWrapper(_changeUserfromDevice),
    getDeviceById:        queryWrapper(_getDeviceById),
    getAllDevices:        queryWrapper(_getAllDevices),

}
