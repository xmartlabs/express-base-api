exports.isEmptyOrWhiteSpace = (str) => {
  return (!str || str.length === 0 || /^\s*$/.test(str));
};
