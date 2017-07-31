const crypto = require('crypto');
const path = require('path');
const url = require('url');
const fs = require('fs');

const express = require('express');
const Message = require('bitcore-message');
const swagger = require('swagger-ui-express');
const yaml = require('js-yaml');

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

    const host = config.hostName + (config.defaultPort === 443 ? '' : (':' + config.defaultPort));

    console.log(host);

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

        /**
         * Identity endpoint
         */
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

        /**
         * Signature endpoint
         */
        if (endpoints.includes('signature')) {
            app.get('/signature', (req, res) => {

                if (req.header('Authorization') !== `Bearer ${secret}`) throw new UnauthorizedError('Bad token');

                const {pubKey, hashToSign} = req.query;
                const signedHash = hashToSign;
                const identityURL = `https://${host}/identity`;

                if (!hashToSign) throw new BadRequestError("Needs 'hashToSign' query parameter");
                if (!/^[a-f0-9]{64}$/.test(hashToSign)) throw new BadRequestError("Query parameter 'hashToSign' has to be an sha256 hash (in lowercase)");
                if (pubKey && pubKey !== publicKey) throw new BadRequestError("Unhandled pubKey");

                const signature = sign(hashToSign);

                res.json({signature, pubKey: publicKey, signedHash, identityURL})

            });
        }

        /**
         * Documentation endpoint
         */
        if (endpoints.includes('documentation')) {
            const buf = fs.readFileSync(path.join(__dirname, '../swagger.yaml'));
            const doc = yaml.load(buf.toString());
            doc.host = host;

            // if the signature endpoint isn't public, we delete the corresponding definitions
            if (!(endpoints.includes('signature'))) {
                delete doc.paths['/signature'];
                delete doc.definitions['SignatureOUT'];
            }

            app.use('/documentation', swagger.serve, swagger.setup(doc));
        }

        app.use(errorHandler.handle404);

        app.use(errorHandler.handle500);

        return app;
    }

    return appFactory;
};