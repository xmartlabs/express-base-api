'use strict';
module.exports = (sequelize, DataTypes) => {
  var Randomnumber = sequelize.define('Randomnumber', {
    lastNumber: { type: DataTypes.INTEGER, allowNull: false }
  }, {});

  return Randomnumber;
};
