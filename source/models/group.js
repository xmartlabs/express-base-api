'use strict';
module.exports = (sequelize, DataTypes) => {
  var Group = sequelize.define('Group', {
    name: DataTypes.STRING
  }, {
  });

  // Class Method
  Group.associate = function (models) {
    models.Group.hasMany(models.UserGroup);
    models.Group.belongsToMany(models.User, {through: 'UserGroup'});
  };
  return Group;
};