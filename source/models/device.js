'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    deviceId: { type: DataTypes.STRING, unique: true, allowNull: false },
    deviceType: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    pnToken: { type: DataTypes.STRING, unique: true }
  }, {});

  // Class Methods
  Device.associate = (models) => {
    models.Device.belongsTo(models.User);
  };

  return Device;
};
