const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const auth = require('./source/api/v1/auth.js');
const authenticate = require('./source/api/utils/authenticate');
const authStrategies = require('./source/api/utils/authStrategies');
const devices = require('./source/api/v1/devices.js');
const emailValidation = require('./source/api/v1/emailValidation.js');
const phoneValidation = require('./source/api/v1/phoneValidation.js')
const users = require('./source/api/v1/user/users.js');

const app = express();
const authRouter = express.Router();
const usersRouter = express.Router();

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

authStrategies.createAuthJWT(passport);
authenticate.createAuthentificationJWT(passport);

app.use(passport.initialize());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/ping', (req, res) => res.send('pong!'));

auth(authRouter, passport);
devices(app);
emailValidation(app);
phoneValidation(app);
users(usersRouter, passport);

app.use(authRouter);
app.use(usersRouter);

//Middleware to handle errors
app.use((err, req, res, next) => {
  if (!err.status) err.status = 500;
  res.status(err.status).json({ name: err.name, message: err.message });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

exports.app = app
