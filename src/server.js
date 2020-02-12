// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const HTTP = require('http');
const HTTPS = require('https');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('colors');
const override = require('method-override');
const compression = require('compression');
const colorConsole = require('./lib/log');
const api = require('./api');

const { PORT: port } = process.env;
const { SSLPORT: sslport } = process.env;


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
  colorConsole.success(`[HTTP] Soda Server is started on port ${colors.cyan(port)}`);
});

console.log(fs.readFileSync(path.resolve(process.cwd(), 'keys/takeup.co.kr_20200210NO36.crt.pem'), 'utf8').toString());


try {
  HTTPS.createServer({
    ca: fs.readFileSync(path.resolve(process.cwd(), 'keys/ca-chain-bundle.pem'), 'utf8').toString(),
    key: fs.readFileSync(path.resolve(process.cwd(), 'keys/takeup.co.kr_20200210NO36.key.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), 'keys/takeup.co.kr_20200210NO36.crt.pem'), 'utf8').toString(),
  // eslint-disable-next-line no-shadow
  }).listen(sslport, () => {
    colorConsole.green(`[HTTPS] Soda Server is started on port ${colors.cyan(sslport)}`);
  });
} catch (error) {
  colorConsole.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
  colorConsole.warn(error);
}
