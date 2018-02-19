module.exports = class UnauthorizedException extends require('./AppError') {
  constructor (message) {
    super(message || 'Unauthorized', 401);
  }
};
