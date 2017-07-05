const https = require('https');

const store = require('./app/store');
const config = require('./app/config');
const appFactory = require('./app');

const key = store.getKey();
const cert = store.getCert();

const DEFAULT_PORT = 4443;
const SIGNATURE_PORT = parseInt(config.signaturePort);

if (config.signaturePort) {
    https.createServer({key, cert}, appFactory(['signature'])).listen(SIGNATURE_PORT);
    https.createServer({key, cert}, appFactory(['identity'])).listen(DEFAULT_PORT);
} else {
    https.createServer({key, cert}, appFactory(['identity', 'signature'])).listen(DEFAULT_PORT);
}
