const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
