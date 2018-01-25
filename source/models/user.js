'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    cellPhoneNumber: DataTypes.STRING,
    cellPhoneCounty_code: DataTypes.STRING(16),
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, nullable: false },
    active: { type: DataTypes.BOOLEAN, nullable: false, defaultValue: true },
    roles: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    password: DataTypes.STRING,
    fbId: { type: DataTypes.STRING , unique: true },
    fbAccessToken: DataTypes.STRING,
    emailValidationCode: DataTypes.STRING(4),
    emailPhoneValidationCodeExpiration: DataTypes.DATE,
    emailValidationDate: DataTypes.DATE,
    cellPhoneValidationCode: DataTypes.STRING(4),
    cellPhoneValidationCodeExpiration: DataTypes.DATE,
    cellPhoneValidationDate: DataTypes.DATE,
  }, {
  });

  // Class Method
  User.associate = function (models) {
    models.User.hasMany(models.Device);
    models.User.hasMany(models.UserGroup);
    models.User.belongsToMany(models.Group, {through: 'UserGroup'});
  };

  User.secureAttributes = function () {
    return ['id', 'firstName', 'lastName',  'cellPhoneNumber', 'cellPhoneCounty_code', 'username', 'email', 'active', 'roles', 'fbId'];
  };

  User.serialize = function (user) {
    let serializedUser = JSON.stringify(user);
    return JSON.parse(serializedUser);
  };

  // Instance Method
  //User.prototype.someMethod = function () {..}

  return User;
};