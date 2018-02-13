'use strict';
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Devices', [{
      deviceId: '1',
      deviceType: 'Mobile',
      pnToken: '1',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      deviceId: '2',
      deviceType: 'Mobile',
      pnToken: '2',
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Devices', null, {});
  }
};
