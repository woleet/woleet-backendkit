const crypto = require('crypto');

const express = require('express');
const Message = require('bitcore-message');

const errorHandler = require('http-typed-errors');
const {BadRequestError, UnauthorizedError} = errorHandler;

/**
 * @param config
 * @param store
 * @returns {appFactory}
 */
module.exports = function (config, store) {

    const secret = store.getSecret();
    /** @type PrivateKey */
    const privateKey = store.getPrivateKey();

    const publicKey = privateKey.toAddress().toString();

    /**
     * @param {string} message
     * @returns string
     */
    const sign = (message) => (new Message(message)).sign(privateKey);

    /**
     * @param {string[]} endpoints
     * @returns {Application}
     */
    function appFactory(endpoints) {

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
                if (pubKey !== publicKey) throw new BadRequestError("Unhandled pubKey");

                const rightData = crypto.randomBytes(32).toString('hex');

                const signature = sign(leftData + rightData);

                res.json({signature, rightData})
            });
        }

        if (endpoints.includes('signature')) {
            app.get('/signature', (req, res) => {

                if (req.header('Authorization') !== `Bearer ${secret}`) throw new UnauthorizedError('Bad token');

                const {pubKey, hashToSign} = req.query;
                const signedHash = hashToSign;
                const identityURL = `https://${config.identityURL}/identity`;

                if (!hashToSign) throw new BadRequestError("Needs 'hashToSign' query parameter");
                if (!/^[a-f0-9]{64}$/.test(hashToSign)) throw new BadRequestError("Query parameter 'hashToSign' has to be an sha256 hash (in lowercase)");
                if (pubKey && pubKey !== publicKey) throw new BadRequestError("Unhandled pubKey");

                const signature = sign(hashToSign);

                res.json({signature, pubKey:publicKey, signedHash, identityURL})

            });
        }

        app.use(errorHandler.handle404);

        app.use(errorHandler.handle500);

        return app;
    }

    return appFactory;
};