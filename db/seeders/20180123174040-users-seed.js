const encryption = require('../../source/api/utils/encryption');
const encryptedPassword = encryption.getHash('Password');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@Doe.com',
      cellPhoneNumber: '096568956',
      cellPhoneCountyCode: '00598',
      username: 'Johnny',
      password: encryptedPassword,
      fbId: 'Johnny',
      fbAccessToken: 'JohnsToken',
      emailValidationCode: '1234',
      emailValidationCodeExpiration: new Date(),
      emailValidationDate: new Date(),
      cellPhoneValidationCode: '1234',
      cellPhoneValidationCodeExpiration: new Date(),
      cellPhoneValidationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Susy',
      lastName: 'Mary',
      email: 'Susy@Mary.com',
      cellPhoneNumber: '097854586',
      cellPhoneCountyCode: '00598',
      username: 'Sussy',
      password: encryptedPassword,
      fbId: 'SusyMary',
      fbAccessToken: 'SusysToken',
      emailValidationCode: '1234',
      emailValidationCodeExpiration: new Date(),
      emailValidationDate: new Date(),
      cellPhoneValidationCode: '1234',
      cellPhoneValidationCodeExpiration: new Date(),
      cellPhoneValidationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
