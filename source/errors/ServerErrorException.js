module.exports = class ServerErrorException extends require('./AppError') {
  constructor (message) {
    // Providing default message and overriding status code.
    super(message || 'Something went wrong', 500);
  }
};
