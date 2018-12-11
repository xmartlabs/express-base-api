const winston = require('winston');
const expressWinston = require('express-winston');
winston.level = process.env.LOG_LEVEL || 'info';

if (process.env.LOGGLY_TOKEN) {
  //avoid loggly import if not used
  require('winston-loggly-bulk');
  winston.add(winston.transports.Loggly, {
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
    tags: [process.env.LOGGLY_TAG],
    json: true
  });
}

const _error    = (...params) => winston.log('error', params);
const _warn     = (...params) => winston.log('warn', params);
const _info     = (...params) => winston.log('info',  params);
const _verbose  = (...params) => winston.log('verbose', params);
const _debug    = (...params) => winston.log('debug', params);
const _silly    = (...params) => winston.log('silly', params);

const _requestLogger = expressWinston.logger({
  transports: [new winston.transports.Console({ json: true, colorize: true })], meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function () { return false; } // optional: allows to skip some log messages based on request and/or response
});

module.exports = {
  requestLogger: _requestLogger,
  error: _error,
  warn: _warn,
  info: _info,
  verbose: _verbose,
  debug: _debug,
  silly: _silly
};
