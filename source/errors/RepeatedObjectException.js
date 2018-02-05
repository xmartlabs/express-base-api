module.exports = class RepeatedObjectException extends require('./AppError') {
  constructor (message) {
    super(message, 400);
  }
};
