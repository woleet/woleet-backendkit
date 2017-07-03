const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ECPair = require('bitcoinjs-lib').ECPair;

const config = require('./config');

const genSecret = () => crypto.randomBytes(32).toString('base64');

const DATA_FILE_PATH = path.join(__dirname, '../data');

function restore() {
    try {
        const read = fs.readFileSync(DATA_FILE_PATH, 'utf8').split(':');
        return {wif: read[0], secret: read[1]};
    } catch (e) {
        return {}
    }
}

function save({wif, secret}) {
    console.log('save', wif, secret);
    try {
        return fs.writeFileSync(DATA_FILE_PATH, [wif, secret].join(':'), 'utf8');
    } catch (e) {
        return {}
    }
}

const restored = restore();
const key = fs.readFileSync(config.keyPath, 'utf8');
const cert = fs.readFileSync(config.certPath, 'utf8');
const secret = config.forceRegenToken ? genSecret() : (restored.secret || genSecret());
const wif = config.forceRegenWIF ? null : (config.WIF || restored.wif || null);
const keyPair = wif ? ECPair.fromWIF(wif) : ECPair.makeRandom();

const _wif = keyPair.toWIF();

if (restored.secret !== secret || restored.wif !== _wif) save({secret, wif: _wif});

console.log(`Token: ${secret}`);
console.log(`Address: ${keyPair.getAddress()}`);
console.log(`WIF: ${keyPair.toWIF()}`);

module.exports = {
    getKey: () => key,
    getCert: () => cert,
    getSecret: () => secret,
    getKeyPair: () => keyPair,
};