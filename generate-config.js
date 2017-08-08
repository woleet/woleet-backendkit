const fs = require('fs');
const assert = require('assert');
const crypto = require('crypto');
const PrivateKey = require('bitcore-lib').PrivateKey;

function readArgs(keys) {
    const args = {};
    const getArg = (key) => (val) => ((match) => match ? args[key] = match[1] : null)(val.match(new RegExp(`^${key}=(.*)$`, 'i')));
    const tests = keys.map(key => getArg(key));
    process.argv.forEach((key) => tests.forEach(test => test(key)));
    return args;
}

const args = readArgs(['restoreWIF', 'restoreToken']);

// partial configuration, needs to be completed at runtime (for key/cert)
const config = {
    restoreWIF: args.restoreWIF || null,
    restoreToken: args.restoreToken || crypto.randomBytes(32).toString('base64')
};

if (!config.restoreWIF) {
    const privateKey = PrivateKey.fromRandom();
    config.restoreWIF = privateKey.toWIF();
    config.address = privateKey.toAddress().toString();
} else {
    let privateKey = null;
    try {
        privateKey = PrivateKey.fromWIF(config.restoreWIF);
    } catch (e) {
    }
    if (!privateKey || privateKey.toWIF() !== config.restoreWIF) {
        console.error('Error: Invalid WIF');
        process.exit(1);
    }
    config.address = privateKey.toAddress().toString();
}

let conf = '';

for(let key in config) {
    conf += `${key}=${config[key]}\n`
}

fs.writeFileSync('generated-configuration', conf);