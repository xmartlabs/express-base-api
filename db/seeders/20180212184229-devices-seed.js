'use strict';
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Devices', [{
      deviceId: '1',
      deviceType: 'Mobile',
      pnToken: '1',
      createdAt: new Date(),
      updatedAt: new Date(),

    },
    {
      deviceId: '2',
      deviceType: 'Mobile',
      pnToken: '2',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Devices', null, {});
  }
};
