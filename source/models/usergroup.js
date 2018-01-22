'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserGroup = sequelize.define('UserGroup', {
    isAdmin: DataTypes.BOOLEAN
  }, {
  });

  // Class Method
  UserGroup.associate = function (models) {
    models.UserGroup.belongsTo(models.User);
    models.UserGroup.belongsTo(models.Group);
  };
  
  return UserGroup;
};