'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    cellPhoneNumber: DataTypes.STRING,
    cellPhoneCountyCode: DataTypes.STRING(16),
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, nullable: false },
    active: { type: DataTypes.BOOLEAN, nullable: false, defaultValue: true },
    roles: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    password: DataTypes.STRING,
    fbId: { type: DataTypes.STRING, unique: true },
    fbAccessToken: DataTypes.STRING,
    emailValidationCode: DataTypes.STRING(4),
    emailValidationCodeExpiration: DataTypes.DATE,
    emailValidationDate: DataTypes.DATE,
    cellPhoneValidationCode: DataTypes.STRING(4),
    cellPhoneValidationCodeExpiration: DataTypes.DATE,
    cellPhoneValidationDate: DataTypes.DATE,
    passwordValidationCode: DataTypes.STRING(16),
    passwordValidationCodeExpiration: DataTypes.DATE,
  }, {});

  // Class Method
  User.associate = (models) => {
    models.User.hasMany(models.Device, { foreignKey: 'userId' });
    models.User.hasMany(models.UserGroup);
    models.User.belongsToMany(models.Group, { through: 'UserGroup' });
  };

  return User;
};
