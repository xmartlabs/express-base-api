module.exports = class AppError extends Error {
  constructor (message, status) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name and message in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    this.message = message;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    this.status = status || 500;

  }
};
