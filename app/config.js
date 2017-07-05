const env = process.env;

function need(name) {
    const param = env[name];
    if (!param)
        throw new ReferenceError(`Needed parameter "${name}" is not set`);

    return param;
}

const config = {
    identityURL: need('identityURL'),
    WIF: env.restoreWIF || null,
    certPath: need('cert'),
    keyPath: need('key'),
    forceRegenWIF: !!(env.forceRegenWIF || false),
    forceRegenToken: !!(env.forceRegenToken || false),
    signaturePort: env.signaturePort
};

module.exports = config;