// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const HTTP = require('http');
const HTTPS = require('https');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
// const greenLock = require('greenlock-express');
// const createServer = require('auto-sni');
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
// eslint-disable-next-line import/order
// const httpsServer = createServer({
//   email: 'gotjd2720@gamil.com', // Emailed when certificates expire.
//   agreeTos: true, // Required for letsencrypt.
//   debug: false, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
//   domains: ["takeup.co.kr", ["takeup.com", "www.takeup.com"]], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
//   dir: "/letsencrypt/etc", // Directory for storing certificates. Defaults to "~/letsencrypt/etc" if not present.
//   ports: {
//     http: 80, // Optionally override the default http port.
//     https: 443, // // Optionally override the default https port.
//   },
// }, app);

// middleware
app.use('/image', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(override());
app.use(compression());

// api router
app.use('/', api);

server.listen(port, () => {
  colorConsole.success(`[HTTP] Soda Server is started on port ${colors.cyan(port)}`);
});

// HTTPS 서버 열기
// httpsServer.once('listening', () => {
//   colorConsole.green('[HTTPS] on');
// });

// console.log(fs.readFileSync(path.resolve(process.cwd(), 'keys/takeup.co.kr_20200210NO36.crt.pem'), 'utf8').toString());


try {
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/takeup.co.kr/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/takeup.co.kr/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/takeup.co.kr/cert.pem'), 'utf8').toString(),
  };

  HTTPS.createServer(option, app).listen(sslport, () => {
    colorConsole.success(`[HTTPS] Soda Server is started on port ${colors.cyan(sslport)}`);
  });
} catch (error) {
  colorConsole.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
  colorConsole.warn(error);
}
