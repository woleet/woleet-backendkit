const https = require('https');

const store = require('./app/store');
const config = require('./app/config');
const appFactory = require('./app')(config, store);

const key = store.getKey();
const cert = store.getCert();

const DEFAULT_PORT = config.defaultPort;
const SIGNATURE_PORT = config.signaturePort;

if (config.signaturePort) {
    https.createServer({key, cert}, appFactory(['signature']))
        .listen(SIGNATURE_PORT, () => console.log(`Signature server listening on port ${SIGNATURE_PORT}`));
    https.createServer({key, cert}, appFactory(['identity', 'documentation', 'homepage']))
        .listen(DEFAULT_PORT, () => console.log(`Identity server listening on port ${DEFAULT_PORT}`));
} else {
    https.createServer({key, cert}, appFactory(['identity', 'signature', 'documentation', 'homepage']))
        .listen(DEFAULT_PORT, () => console.log(`Server listening on port ${DEFAULT_PORT} for both identity and signature`));
}
