// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const HTTP = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('colors');
const override = require('method-override');
const compression = require('compression');
const api = require('./api');

const { PORT: port } = process.env;

const app = express();
const server = HTTP.createServer(app);

// middleware
app.use('/static', express.static(path.join(__dirname, 'pulbic')));
app.use(cors());
app.use(express.json());
app.use(override());
app.use(compression());

// api router
app.use('/', api);

server.listen(port, () => {
  console.log(`Bamboo Server is started on port ${colors.cyan(port)}`);
});
