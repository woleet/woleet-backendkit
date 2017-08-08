const keys = ['domain', 'cert', 'key', 'restoreWIF', 'restoreToken', 'signaturePort', 'defaultPort', 'forceRegenWIF', 'forceRegenToken', 'cluster'];
const args = readArgs(keys);

function need(name) {
    const param = args[name];
    if (!param) {
        console.error(`Error: Needed parameter "${name}" is not set`);
        process.exit(1);
    }
    return param;
}

function readArgs(keys) {
    const args = {};
    const getArg = (key) => (val) => ((match) => match ? args[key] = match[1] : null)(val.match(new RegExp(`^${key}=(.*)$`, 'i')));
    const tests = keys.map(key => getArg(key));
    process.argv.forEach((key) => tests.forEach(test => test(key)));
    return args;
}

const config = {
    domain: need('domain'),
    restoreWIF: args.restoreWIF || null,
    restoreToken: args.restoreToken || null,
    certPath: need('cert'),
    keyPath: need('key'),
    forceRegenWIF: !!(args.forceRegenWIF || false),
    forceRegenToken: !!(args.forceRegenToken || false),
    defaultPort: args.defaultPort && parseInt(args.defaultPort) || 443,
    signaturePort: args.signaturePort && parseInt(args.signaturePort) || null,
    cluster: args.cluster && parseInt(args.cluster) || 0
};

module.exports = config;