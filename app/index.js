const crypto = require('crypto');

const express = require('express');
const bitcoin = require('bitcoinjs-lib');
const btcSign = require('bitcoinjs-message').sign;

const errorHandler = require('http-typed-errors');
const {BadRequestError, UnprocessableEntityError, UnauthorizedError} = errorHandler;
const config = require('./config');
const store = require('./store');

const prefix = bitcoin.networks.bitcoin.messagePrefix;
const secret = store.getSecret();
/** @type ECPair */
const keyPair = store.getKeyPair();
const privateKeyBuffer = keyPair.d.toBuffer(32);
const privateKeyCompressed = keyPair.compressed;
const publicKey = keyPair.getAddress();

/**
 * @param {string} message
 * @returns string
 */
const sign = (message) => btcSign(message, prefix, privateKeyBuffer, privateKeyCompressed).toString('base64');

module.exports = function (endpoints) {

    /**
     * @type Application
     */
    const app = express();

// allow cross domain
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    if (endpoints.includes('identity')) {
        app.get('/identity', (req, res) => {
            const {pubKey, leftData} = req.query;

            if (!pubKey) throw new BadRequestError("Needs 'pubKey' query parameter");
            if (!leftData) throw new BadRequestError("Needs 'leftData' query parameter");
            if (pubKey !== publicKey) throw new UnprocessableEntityError("Unhandled pubKey");

            const rightData = crypto.randomBytes(32).toString('hex');

            const signature = sign(leftData + rightData);

            res.json({signature, rightData})
        });
    }

    if (endpoints.includes('signature')) {
        app.get('/signature', (req, res) => {
            const {pubKey, hashToSign} = req.query;
            const signedHash = hashToSign;
            const identityURL = `https://${config.identityURL}/identity`;

            if (!pubKey) throw new BadRequestError("Needs 'pubKey' query parameter");
            if (!hashToSign) throw new BadRequestError("Needs 'hashToSign' query parameter");
            if (!/^[a-f0-9]{64}$/.test(hashToSign)) throw new BadRequestError("Query parameter 'hashToSign' has to be an sha256 hash (in lowercase)");
            if (pubKey !== publicKey) throw new UnprocessableEntityError("Unhandled pubKey");
            if (req.header('Authorization') !== `Bearer ${secret}`) throw new UnauthorizedError('Bad token');

            const signature = sign(hashToSign);

            res.json({signature, pubKey, signedHash, identityURL})

        });
    }

    app.use(errorHandler.handle404);

    app.use(errorHandler.handle500);

    return app;
};