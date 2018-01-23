'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    entityType: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    entityDescription: DataTypes.STRING,
    entity2Type: DataTypes.STRING,
    entity2Id: DataTypes.INTEGER,
    entity2Description: DataTypes.STRING,
    entity3Type: DataTypes.STRING,
    entity3Id: DataTypes.INTEGER,
    entity3Description: DataTypes.STRING,
    expirationDate: DataTypes.DATE,
    isProcessed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
  }, {
  });

  // Class Method
  Event.associate = function (models) {
    models.Event.belongsTo(models.EventDescriptor, { 
      foreingKey: {
        allowNull: false
      }
    });
    models.Event.belongsTo(models.Group);
    models.Event.belongsTo(models.User);
  };

  Event.prototype.pushNotificationData = function() {
    // event_descriptor = self.event_descriptor
    // message_template = event_descriptor.description
    // if self.entity_description:
    //     message_template = message_template.replace("{1}", self.entity_description)
    // if self.entity_2_description:
    //     message_template = message_template.replace("{2}", self.entity_2_description)
    // if self.entity_3_description:
    //     message_template = message_template.replace("{3}", self.entity_3_description)
    // devices = Device.query_active_devices_for_group(group=self.group, discard_user_ids=[self.creator_id]).all()
    // pn_tokens = [device.pn_token for device in devices]
    // return "Hi", message_template, pn_tokens

  }

  return Event;
};