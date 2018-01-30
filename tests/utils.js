const { User } = require('../source/models');

exports.addUser = async (username, email, fbId) => {
    const userToAdd = {
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        cellPhoneNumber: '096568956',
        cellPhoneCounty_code: '00598',
        username: username,
        password: 'Password',
        fbId: fbId,
        fbAccessToken: 'JohnsToken',
        emailValidationCode: '1234',
        emailPhoneValidationCodeExpiration: new Date(),
        emailValidationDate: new Date(),
        cellPhoneValidationCode: '1234',
        cellPhoneValidationCodeExpiration: new Date(),
        cellPhoneValidationDate: new Date()
    };

    const result = await User.create(userToAdd);
    return result.get({ plain: true });
};

exports.serializeUsers = (user) => {
    return User.serialize(user);
}