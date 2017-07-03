const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ECPair = require('bitcoinjs-lib').ECPair;

const config = require('./config');

function restore() {
    try {
        const read = fs.readFileSync(path.join(__dirname, '../data'), 'utf8').split(':');
        return {wif: read[0], secret: read[1]};
    } catch (e) {
        return {}
    }
}

function save({wif, secret}) {
    try {
        return fs.writeFileSync(path.join(__dirname, '../data'), [wif, secret].join(':'), 'utf8');
    } catch (e) {
        return {}
    }
}

const restored = restore();
const key = fs.readFileSync(config.keyPath, 'utf8');
const cert = fs.readFileSync(config.certPath, 'utf8');
const secret = restored.secret || crypto.randomBytes(32).toString('base64');
const wif = config.WIF || restored.wif || null;
const keyPair = wif ? ECPair.fromWIF(wif) : ECPair.makeRandom();

if (!restored.secret || !restored.wif) save({secret, wif});

console.log(`Token: ${secret}`);
console.log(`Address: ${keyPair.getAddress()}`);
console.log(`WIF: ${keyPair.toWIF()}`);

module.exports = {
    getKey: () => key,
    getCert: () => cert,
    getSecret: () => secret,
    getKeyPair: () => keyPair,
};