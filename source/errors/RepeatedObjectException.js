module.exports = class RepeatedObjectException extends require('./AppError') {
  constructor (message, fields=null) {
    super(message, 400);
    this.fields = fields;
  }
};
