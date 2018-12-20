const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const auth = require('./source/api/v1/auth');
const authStrategies = require('./source/api/authMiddlewares');
const devices = require('./source/api/v1/device/devices');
const emailValidation = require('./source/api/v1/emailValidation');
const phoneValidation = require('./source/api/v1/phoneValidation');
const users = require('./source/api/v1/user/users');
const logger = require('./source/utils').logger;

const app = express();
const authRouter = express.Router();
const deviceRouter = express.Router();
const usersRouter = express.Router();

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

authStrategies.createAuthStrategies(passport);

app.use(logger.requestLogger);
app.use(passport.initialize());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/ping', (req, res) => res.send('pong!'));

auth(authRouter, passport);
devices(deviceRouter, passport);
emailValidation(app);
phoneValidation(app);
users(usersRouter, passport);

app.use('/v1', authRouter);
app.use('/v1', deviceRouter);
app.use('/v1', usersRouter);

//Middleware to handle errors
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const apiError = { 
    name: err.name, 
    message: err.message, 
    fields: err.fields || null,
  };
  res.status(errorStatus).json(apiError);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

exports.app = app;
