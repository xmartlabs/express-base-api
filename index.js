const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');
const authStrategies = require('./source/api/utils/authStrategies');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

authStrategies.createAuthJWT(passport);

app.use(passport.initialize());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/ping', (req, res) => res.send('pong!'));

const authRouter = express.Router();
require('./source/api/v1/auth.js')(authRouter, passport);
app.use(authRouter);

require('./source/api/v1/devices.js')(app);
require('./source/api/v1/emailValidation.js')(app);
require('./source/api/v1/phoneValidation.js')(app);

const usersRouter = express.Router();
require('./source/api/v1/user/users.js')(usersRouter);
app.use(usersRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

exports.app = app