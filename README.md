## Woleet backend kit

The Woleet backend kit provides tools allowing your backend to easily:
 * manage its bitcoin identity
 * sign some data using its bitcoin identity
 * prove to the world its bitcoin identity

The kit is made of:
 * an installation script allowing to generate and restore a bitcoin identity for your backend
 * a NodeJS server exposing a REST API
 
This API provides two endpoints:
 * `/identity` allows **anyone** to verify that your backend effectively owns its claimed bitcoin address
 * `/signature` allows **your backend** (and only yours) to sign some data using its bitcoin identity

The Woleet backend kit also exposes the documentation of its own API on the `/documentation` endpoint.

### Prerequisites

In order to run this server you will need:
- A web domain.
- A TLS certificate (and key) for your domain.
- For a docker usage: Docker is installed on your system. 
- For a node-only usage: "forever" is globally installed on your system (npm i -g forever`)

### Installation

Clone the project: git clone git@github.com:woleet/woleet-backendkit.git` or download https://github.com/woleet/woleet-backendkit/archive/master.zip and uncompress it.

### First run with the helper script initialize-docker.sh or initialize-node.sh 

Simply run the "initialise-[node|docker].sh" script with the following parameters:
- cert=<PATH_TO_CERTIFICATE> path to your certificate.
- key=<PATH_TO_CERTIFICATE_KEY> path to your certificate's key.
- hostName=<YOUR-DOMAIN> (in order to match with "https://<YOUR-DOMAIN>/identity").
- signaturePort=<SIGNATURE_PORT> (optional), useful if you want to expose the "/signature" endpoint on an other port.
- defaultPort=<IDENTITY_PORT> (optional, default: 443), expose the "/identity" endpoint on an specific port.
- "--regen-token" (optional),force a new token generation.
- "--regen-wif"(optional), force a new private key generation.
- "--cluster"(optional), uses node [cluster](https://nodejs.org/docs/latest/api/cluster.html#cluster_cluster) api to handle the load.


The helper script will:
- Ask you if you want to restore a `private key` or generate a new one.
- Display you the generated `private key`, `access token` and `address` (public key). 
 You will have to write them down carefully.
 
You will need the `access token` to use the "/signature" endpoint.

Example:<br>
`./initialize-docker.sh hostName=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`
<br>or:<br>
`./initialize-node.sh hostName=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`

### Running the backend kit without the helper script:

In addition to `cert`, `key`, `hostName` ,`defaultPort` and `signaturePort` (see above), running 
the backend kit without the helper script allows you to set some extra parameters:
 - restoreWIF=<bitcoin WIF private key> (optional) private key as Wallet Import Format (base 58); if not provided a random key is generated
 - restoreToken=<TOKEN> (optional), if not provided a random token is generated.
 - "forceRegenWIF=1" (optional), force a new private key generation (if set: restoreWIF will be ignored).
 - "forceRegenToken=1" (optional), force a new token generation (if set: restoreToken will be ignored).
 - "cluster=1" (optional), see `--cluster` above.
 
Example:
```bash
npm start hostName=localhost \
    key=~/ssl/selfsigned.key \
    cert=~/ssl/selfsigned.crt \
    forceRegenWIF=1 \
    forceRegenToken=1 \
    defaultPort=4443 \
    signaturePort=5443
```

To run it as a daemon, you have to use `forever`, for example:
```bash
forever start main.js hostName=localhost \
    key=~/ssl/selfsigned.key \
    cert=~/ssl/selfsigned.crt \
    restoreWIF=${MY_PRIVATE_KEY}
```
 
Note that you **should not** use the restoreWIF/restoreToken options directly via the command line because of the command history. 

### Endpoints description:

Detailed description of the API is described in the swagged.yaml file contained in this repository it can be imported at [editor.swagger.io](https://editor.swagger.io/).