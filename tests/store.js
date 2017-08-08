const PrivateKey = require('bitcore-lib').PrivateKey;

const config = require('./config');

const secret = config.restoreToken;
const wif = config.restoreWIF;
const privateKey = PrivateKey.fromWIF(wif);

console.log(`API token: ${secret}`);
console.log(`Bitcoin address: ${privateKey.toAddress()}`);
console.log(`Private key (WIF): ${privateKey.toWIF()}`);

module.exports = {
    getKey: () => null,
    getCert: () => null,
    getSecret: () => secret,
    getPrivateKey: () => privateKey,
};