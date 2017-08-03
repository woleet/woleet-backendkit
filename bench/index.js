const crypto = require('crypto');
const fs = require('fs');

const benchmark = require('api-benchmark');

const DEFAULT_PUBKEY = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN';

const routes = {
    signature: {
        method: 'get',
        route: `/signature`,
        query: () => ({pubKey: DEFAULT_PUBKEY, hashToSign: crypto.randomBytes(32).toString('hex')}),
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer 123456'
        }
    },
    identity: {
        method: 'get',
        route: `/identity`,
        query: () => ({pubKey: DEFAULT_PUBKEY, leftData: crypto.randomBytes(8).toString('hex')}),
        headers: {
            'Accept': 'application/json'
        }
    },
    homepage: {
        method: 'get',
        route: `/`,
        headers: {
            'Accept': 'text/html'
        }
    }
};

const options = {
    runMode: 'parallel',
    minSamples: 10000,
    maxConcurrentRequests: 100
};

// running server benchmark
benchmark.measure({server: "https://localhost:1234/"}, routes, options, (err, results) => {
    if (err) return console.error(err);
    fs.writeFileSync('bench-server-results.json', JSON.stringify(results, null, 2));
    benchmark.getHtml(results, function (error, html) {
        if (error) console.error(error);
        else fs.writeFileSync('bench-server-results.html', html)
    });

    // running cluster benchmark after
    benchmark.measure({cluster: "https://localhost:4567/"}, routes, options, (err, results) => {
        if (err) return console.error(err);
        fs.writeFileSync('bench-cluster-results.json', JSON.stringify(results, null, 2));
        benchmark.getHtml(results, function (error, html) {
            if (error) console.error(error);
            else fs.writeFileSync('bench-cluster-results.html', html)
        });
    });
});