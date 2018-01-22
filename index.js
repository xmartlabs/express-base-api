const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }));

app.get('/ping', (req, res) => res.send('pong!'));

require('./source/api/v1/auth.js')(app)
require('./source/api/v1/devices.js')(app)
require('./source/api/v1/emailValidation.js')(app)
require('./source/api/v1/phoneValidation.js')(app)
require('./source/api/v1/users.js')(app)

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

exports.app = app