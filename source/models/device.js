'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    deviceId: { 
      type: DataTypes.STRING, 
      unique: true, 
      allowNull: false,
      validate: { 
        notEmpty: true
      } 
    },
    deviceType: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: { 
        notEmpty: true
      } 
    },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    pnToken: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true,
      validate: { 
        notEmpty: true
      } 
    }
  }, {});

  // Class Methods
  Device.associate = (models) => {
    models.Device.belongsTo(models.User, { foreignKey: 'userId'});
  };

  return Device;
};
