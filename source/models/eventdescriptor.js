'use strict';
module.exports = (sequelize, DataTypes) => {
  var EventDescriptor = sequelize.define('EventDescriptor', {
    name: { type: DataTypes.STRING, allowNull: false },
    description:{ type: DataTypes.STRING, allowNull: false},

  }, {
  });

  EventDescriptor.associate = (models) => {
    // associations can be defined here
    models.EventDescriptor.hasMany(models.Event)
  };

  return EventDescriptor;
};
