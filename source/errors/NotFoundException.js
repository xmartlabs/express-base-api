module.exports = class NotFoundException extends require('./AppError') {
  constructor (message) {
    super(message, 404);
  }
};
