const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PrivateKey = require('bitcore-lib').PrivateKey;

const config = require('./config');

const genSecret = () => crypto.randomBytes(32).toString('base64');

const DATA_FILE_PATH = path.join(__dirname, '../.data');

function restore() {
    try {
        const read = fs.readFileSync(DATA_FILE_PATH, 'utf8').split(':');
        return {wif: read[0], secret: read[1]};
    } catch (e) {
        return {}
    }
}

function save({wif, secret}) {
    try {
        return fs.writeFileSync(DATA_FILE_PATH, [wif, secret].join(':'), 'utf8');
    } catch (err) {
        console.error(err);
        return {}
    }
}

const restored = restore();
const key = fs.readFileSync(config.keyPath, 'utf8');
const cert = fs.readFileSync(config.certPath, 'utf8');
const secret = (!config.forceRegenToken) && (config.restoreToken || restored.secret) || genSecret();
const wif = (!config.forceRegenWIF) && (config.restoreWIF || restored.wif) || null;
const privateKey = wif ? PrivateKey.fromWIF(wif) : PrivateKey.fromRandom();

const _wif = privateKey.toWIF();

if (restored.secret !== secret || restored.wif !== _wif) save({secret, wif: _wif});

console.log(`API token: ${secret}`);
console.log(`Bitcoin address: ${privateKey.toAddress()}`);
console.log(`Private key (WIF): ${privateKey.toWIF()}`);

module.exports = {
    getKey: () => key,
    getCert: () => cert,
    getSecret: () => secret,
    getPrivateKey: () => privateKey,
};