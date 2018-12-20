module.exports = class MissingDataException extends require('./AppError') {
  constructor (message, fields=null) {
    super(message || 'Missing essential data', 400);
    this.fields = fields;
  }
};
