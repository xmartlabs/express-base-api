exports.isEmptyOrWhiteSpace = (str) => {
  return (!str || str.length === 0 || /^\s*$/.test(str));
};

exports.hasNumber = (str) => {
  return /^(?=.*[0-9])/.test(str);
};

exports.hasLowerCase = (str) => {
  return /^(?=.*[a-z])/.test(str);
};

exports.hasUpperCase = (str) => {
  return /^(?=.*[A-Z])/.test(str);
};

exports.isSixCharactersOrLonger = (str) => {
  return /^(?=.{6,})/.test(str);
};
