const common = require('../utils/common');
const { Device } = require('../models');
const { NotFoundException, MissingDataException } = require('../errors');
const queryWrapper = require('./queryWrapper.js').exceptionWrapper;
const userDAO = require('./userDAO');

const addDevice = async (device) => {
  if (!device) {
    throw new MissingDataException('Missing device parameters');
  }
  const createdDevice = await Device.create(device);
  return createdDevice.get({ plain: true });
};

const getDeviceById = async (deviceId) => {
  const device = await Device.findOne({
    where: { deviceId },
  });
  if (!device) throw new NotFoundException('Device does not exist');
  return device.get({ plain: true });
};

const changeUserfromDevice = async (deviceId, userId) => {
  let deviceChanged = false;
  await userDAO.getUserById(userId);
  await getDeviceById(deviceId);
  const device = await Device.update(
    { userId },
    { where: { deviceId, active: true } },
  );
  if (device[0] === 1) deviceChanged = true;
  return deviceChanged;
};

const getAllDevices = async () => {
  try {
    const device = await Device.findAll({ raw: true });
  } catch (error) {
    if (!device) throw new NotFoundException('Device does not exist');
  }
};

exports.validateEmptyDeviceFields = (device) => {
  if (
    !device
    || common.isEmptyOrWhiteSpace(device.deviceId)
    || common.isEmptyOrWhiteSpace(device.deviceType)
    || common.isEmptyOrWhiteSpace(device.pnToken)) {
    throw new MissingDataException('Missing data from device');
  }
};

module.exports = {
  addDevice: queryWrapper(addDevice),
  changeUserfromDevice: queryWrapper(changeUserfromDevice),
  getDeviceById: queryWrapper(getDeviceById),
  getAllDevices: queryWrapper(getAllDevices),
};
