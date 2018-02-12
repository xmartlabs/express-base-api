module.exports = class ServerErrorException extends require('./AppError') {
  constructor (message) {
    super(message || 'Something went wrong', 500);
  }
};
