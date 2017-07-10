const messagePrefix = '\x18Bitcoin Signed Message:\n';

const verify = require('bitcoinjs-message').verify;

/**
 * @param rand
 * @param pubKey
 * @param res
 * @returns {{valid: boolean, reason?: string}}
 */
function validateIdentity(rand, pubKey, res) {
    return validateSignature(rand + res.rightData, pubKey, res.signature)
}

/**
 * @param message
 * @param address
 * @param signature
 * @returns {{valid:boolean, reason?:string}}
 */
function validateSignature(message, address, signature) {
    try {
        return {valid: verify(message, messagePrefix, address, signature)};
    } catch (err) {
        return {
            valid: false,
            reason: err.message
        }
    }
}


const isHex = (str) => /^[a-f0-9]+$/.test(str);

const isBase64 = (str) => Buffer.from(str, 'base64').toString('base64') === str;

module.exports = {validateSignature, validateIdentity, isHex, isBase64};
