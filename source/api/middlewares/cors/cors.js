const appConfig = require('config');
const cors = require('cors');

const corsConfig = appConfig.get("cors");

module.exports = () => {
  return cors({
    origin: function (origin, callback) {
      if (!origin) {
        // Allow requests with no origin set (like curl or mobile)
        return callback(null, true);
      }

      // allow requests with no origin (like mobile apps or curl requests)
      if (corsConfig.allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not ' +
            "allow access from the specified Origin ${origin}";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  });
};