'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      cellPhoneNumber: {
        type: Sequelize.STRING
      },
      cellPhoneCountyCode: {
        type: Sequelize.STRING(16)
      },
      email: {
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        nullable: false,
        defaultValue: true
      },
      roles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      password: {
        type: Sequelize.STRING
      },
      fbId: {
        type: Sequelize.STRING ,
        unique: true
      },
      fbAccessToken: {
        type: Sequelize.STRING,
      },
      emailValidationCode: {
        type: Sequelize.STRING(4),
      },
      emailValidationCodeExpiration: {
        type: Sequelize.DATE
      },
      emailValidationDate: {
        type: Sequelize.DATE
      },
      cellPhoneValidationCode: {
        type: Sequelize.STRING(4)
      },
      cellPhoneValidationCodeExpiration: {
        type: Sequelize.DATE
      },
      cellPhoneValidationDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
