const PrivateKey = require('bitcore-lib').PrivateKey;

const config = require('./config');

const secret = '123456';
const wif = config.WIF;
const privateKey = PrivateKey.fromWIF(wif);

console.log(`Token: ${secret}`);
console.log(`Address: ${privateKey.toAddress()}`);
console.log(`WIF: ${privateKey.toWIF()}`);

module.exports = {
    getKey: () => null,
    getCert: () => null,
    getSecret: () => secret,
    getPrivateKey: () => privateKey,
};