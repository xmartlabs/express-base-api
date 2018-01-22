'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    deviceId: { type: DataTypes.STRING, unique: true, allowNull: false },
    deviceType: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    pnToken: { type: DataTypes.STRING, unique: true }
  }, {
  });

  // Class Methods
  Device.associate = function (models) {
    Device.belongsTo(models.User)
  };

  Device.queryActiveDevicesForUser = function (user) {
    //return Device.query.filter(Device.user_id == user.id, Device.active == True, Device.pn_token.isnot(None))
  };

  Device.queryActiveDevicesForGroup = function (group, discard_user_ids) {
    // discard_user_ids = discard_user_ids or []
    // user_ids = [user.user_id for user in group.associated_users if user.user_id not in discard_user_ids]
    // return Device.query.filter(Device.user_id.in_(tuple(user_ids)), Device.active == True,
    //                            Device.pn_token.isnot(None))
  };

  // Device.createOrUpdate(device_id, device_type: str, user:User=None, active: bool = True, pn_token: str=None):
  //     device = Device.first_by(device_id=device_id)
  //     if not device:
  //         device = Device(device_id=device_id, device_type=device_type, user=user, active=active, pn_token=pn_token)
  //         db.session.add(device)
  //     else:
  //         device.device_type = device_type
  //         device.active = active
  //         if user:
  //             device.user = user
  //         if pn_token:
  //             device.pn_token = pn_token
  //     return device



  // Instance Method
  //Device.prototype.someMethod = function () {..}

  return Device;
};

