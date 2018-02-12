const serialize = (user) => {
  const serializedUser = { ...user };
  delete serializedUser['cellPhoneValidationCode'];
  delete serializedUser['cellPhoneValidationCodeExpiration'];
  delete serializedUser['cellPhoneValidationDate'];
  delete serializedUser['created_at'];
  delete serializedUser['emailPhoneValidationCodeExpiration'];
  delete serializedUser['emailValidationCode'];
  delete serializedUser['emailValidationDate'];
  delete serializedUser['fbAccessToken'];
  delete serializedUser['password'];
  delete serializedUser['updated_at'];
  return serializedUser;
};

const serializeList = (users) => {
  return users.map(x => serialize(x));
};

module.exports = {
  serialize,
  serializeList
}
