'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entityType: {
        type: Sequelize.STRING
      },
      entityId: {
        type: Sequelize.INTEGER
      },
      entityDescription: {
        type: Sequelize.STRING
      },
      entity2Type: {
        type: Sequelize.STRING
      },
      entity2Id: {
        type: Sequelize.INTEGER
      },
      entity2Description: {
        type: Sequelize.STRING
      },
      entity3Type: {
        type: Sequelize.STRING
      },
      entity3Id: {
        type: Sequelize.INTEGER
      },
      entity3Description: {
        type: Sequelize.STRING
      },
      expirationDate: {
        type: Sequelize.DATE
      },
      isProcessed: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false, 
        allowNull: false 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      eventDescriptorId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'EventDescriptors',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};