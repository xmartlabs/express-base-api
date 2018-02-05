module.exports = class MissingDataException extends require('./AppError') {
  constructor (message) {
    super(message || 'Missing essential data', 400);
  }
};
