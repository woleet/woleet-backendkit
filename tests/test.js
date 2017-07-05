const request = require('supertest');
const store = require('./store');
const config = require('./config');
const assert = require("assert");
const {validateSignature, validateIdentity} = require('./util');

const appFactory = require('../app')(config, store);

const isHex = (str) => /^[a-f0-9]+$/.test(str);
const isBase64 = (str) => Buffer.from(str, 'base64').toString('base64') === str;

describe('Availability tests', function () {
    const identityApp = appFactory(['identity']);
    it('should not find undefined endpoint', function (done) {
        request(identityApp).post('/').send({}).expect(404).end(done)
    });

    it('should not find signature endpoint if not asked in endpoints', function (done) {
        request(identityApp).get('/signature').expect(404).end(done)
    });

    it('should find identity (with BadRequestError) if asked in endpoints', function (done) {
        request(identityApp).get('/identity').expect(400).end(done)
    });

    const signatureApp = appFactory(['signature']);

    it('should not find identity endpoint if not asked in endpoints', function (done) {
        request(signatureApp).get('/identity').expect(404).end(done)
    });

    it('should find signature (with UnauthorizedError) if asked in endpoints', function (done) {
        request(signatureApp).get('/signature').expect(401).end(done)
    });

});

describe('Identity tests', function () {
    const identityApp = appFactory(['identity']);

    it('signature should be valid', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN',
            leftData: '5qse4648e536rse5bg9487sef684sz'
        };

        request(identityApp)
            .get('/identity')
            .query(query)
            .expect(200)
            .expect((res) => {
                const body = res.body;
                assert(body);
                assert(isBase64(body.signature));
                assert(body.signature);
                assert(isHex(body.rightData));
                assert(validateSignature(query.leftData + body.rightData, query.pubKey, body.signature).valid === true)
            })
            .end(done)
    });

    it('should return 400 if unknown pubkey', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzM',
            leftData: '5qse4648e536rse5bg9487sef684sz'
        };

        request(identityApp).get('/identity').query(query).expect(400).end(done)
    });

    it('should return 400 if missing pubkey', function (done) {
        const query = {
            leftData: '5qse4648e536rse5bg9487sef684sz'
        };

        request(identityApp).get('/identity').query(query).expect(400).end(done)
    });

    it('should return 400 if missing leftData', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzM'
        };

        request(identityApp).get('/identity').query(query).expect(400).end(done)
    });

});

describe('Signature tests', function () {
    const app = appFactory(['signature']);
    const auth = 'Bearer 123456';

    it('signature should return UnauthorizedError with bad token', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN',
            hashToSign: '2224fa760fe5b392a8de47b3e889b10446e9cb99cce09f8849c9a8f29186f303'
        };

        request(app)
            .get('/signature').set('Authorization', 'Bearer 1234').query(query).expect(401).end(done)
    });

    it('signature should be valid with valid data', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN',
            hashToSign: '2224fa760fe5b392a8de47b3e889b10446e9cb99cce09f8849c9a8f29186f303'
        };

        request(app)
            .get('/signature')
            .set('Authorization', auth)
            .query(query)
            .expect(200)
            .expect((res) => {
                const body = res.body;
                const {signature, pubKey, signedHash, identityURL} = body;

                assert(body);
                assert(isBase64(signature));
                assert(signature);
                assert(isHex(signedHash));
                assert(validateSignature(query.hashToSign, query.pubKey, signature).valid === true);
                assert.equal(pubKey, query.pubKey);
                assert.equal(identityURL, 'https://test/identity');
            })
            .end(done)
    });

    it('signature should return BadRequestError with invalid hashToSign (1) (i.e.: non-lowercase sha256)', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN',
            hashToSign: 'hello world'
        };

        request(app).get('/signature').set('Authorization', auth).query(query).expect(400).end(done)
    });

    it('signature should return BadRequestError with invalid hashToSign (2)', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN',
            hashToSign: '2224fa760fe5B392a8de47b3e889b10446e9cb99cce09f8849c9a8f29186f303'
        };

        request(app).get('/signature').set('Authorization', auth).query(query).expect(400).end(done)
    });

    it('signature should return BadRequestError with missing hashToSign', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN'
        };

        request(app).get('/signature').set('Authorization', auth).query(query).expect(400).end(done)
    });

    it('signature should return BadRequestError with missing pubKey', function (done) {
        const query = {
            hashToSign: '2224fa760fe5b392a8de47b3e889b10446e9cb99cce09f8849c9a8f29186f303'
        };

        request(app).get('/signature').set('Authorization', auth).query(query).expect(400).end(done)
    });

    it('signature should return BadRequestError with unknown pubKey', function (done) {
        const query = {
            pubKey: '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzM',
            hashToSign: '2224fa760fe5b392a8de47b3e889b10446e9cb99cce09f8849c9a8f29186f303'
        };

        request(app).get('/signature').set('Authorization', auth).query(query).expect(400).end(done)
    });

});