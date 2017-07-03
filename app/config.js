const env = process.env;

function need(name) {
    const param = env[name];
    if (!param)
        throw new ReferenceError(`Needed parameter "${name}" is not set`);

    return param;
}

const config = {
    identityURL: need('identityURL'),
    WIF: env.restore || null,
    certPath: need('cert'),
    keyPath: need('key'),
    signaturePort: env.signaturePort
};

module.exports = config;