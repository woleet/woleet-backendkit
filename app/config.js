const args = {};
const getArg = (dst) => (key) => (val) => ((match) => match ? dst[key] = match[1] : null)(val.match(new RegExp(`^${key}=(.*)$`, 'i')));
const keys = ['hostName', 'cert', 'key', 'restoreWIF', 'restoreToken', 'signaturePort', 'defaultPort', 'forceRegenWIF', 'forceRegenToken'];
const tests = keys.map(key => getArg(args)(key));

process.argv.forEach((key) => tests.forEach(test => test(key)));

function need(name) {
    const param = args[name];
    if (!param)
        throw new ReferenceError(`Needed parameter "${name}" is not set`);

    return param;
}

const config = {
    hostName: need('hostName'),
    restoreWIF: args.restoreWIF || null,
    restoreToken: args.restoreToken || null,
    certPath: need('cert'),
    keyPath: need('key'),
    forceRegenWIF: !!(args.forceRegenWIF || false),
    forceRegenToken: !!(args.forceRegenToken || false),
    defaultPort: args.defaultPort && parseInt(args.defaultPort) || 443,
    signaturePort: args.signaturePort && parseInt(args.signaturePort) || null
};

module.exports = config;