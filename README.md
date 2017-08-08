## Woleet backend kit

The Woleet backend kit facilitates the integration of Woleet's
 [signature anchoring](https://medium.com/@woleet/beyond-data-anchoring-bee867d9be3a)
  functionality into your backend workflow, by providing all you need for your backend to easily:
 * manage its bitcoin identity (ie. its private key and bitcoin address)
 * sign some data using its bitcoin identity
 * expose and prove to the world its bitcoin identity

The kit is made of:
 * an initialization script allowing to generate and restore a bitcoin identity for your backend
 * a NodeJS server exposing a REST API
 
This API provides two endpoints:
 * `/identity` allows **anyone** to verify that your backend effectively owns its claimed bitcoin address
 * `/signature` allows **your backend** (and only it) to sign some data using its bitcoin address

The documentation of this API is exposed on the `/documentation` endpoint.

### Prerequisites

To run the NodeJS server, you will need:
* a web domain (eg. https://mycompany.com)
* a SSL/TLS certificate (and the associated key) associated to your web domain

NodeJS needs to be installed on your system.
To run the NodeJS server into a Docker container, you also need to install Docker on your system. 

### Initialize the server

Clone the project (`git clone git@github.com:woleet/woleet-backendkit.git`) or download `https://github.com/woleet/woleet-backendkit/archive/master.zip` and uncompress it.

Go to the installation directory.

Choose which version of the initialization script you want to use: 2 versions are provided, initialize-docker.sh and initialize-node.sh, depending on whether you want to run the NodeJS server directly or embed it into a Docker container.

Run the initialization script with the following parameters:
- cert=<PATH_TO_CERTIFICATE> path to your certificate.
- key=<PATH_TO_CERTIFICATE_KEY> path to your certificate's key.
- domain=<YOUR_DOMAIN> (in order to match with "https://<YOUR_DOMAIN>/identity").
- signaturePort=<SIGNATURE_PORT> (optional, default 443), set it if you want to expose the "/signature" endpoint on an other port.
- defaultPort=<IDENTITY_PORT> (optional, default: 443), set it if you want to expose the "/identity" endpoint on an specific port.
- --cluster (optional), set it to use node [cluster](https://nodejs.org/docs/latest/api/cluster.html#cluster_cluster) mode to handle a higher load.

The initialization script will:
- Ask you if you want to restore a private key (WIF) or generate a new one.
- Ask you if you want to restore an API token or generate a new one.
- Display your private key (WIF), your API token and your bitcoin address (public key).
- Display the command line to use to run the NodeJS server.

**WARNING: The private key (WIF) is required to restore your bitcoin identity in case of system loss, and the API token is required to use the "/signature" endpoint.
Be careful to write down and backup these 2 information carefully in order to restore your identity and service in case of server loss.**

Example:

`./initialize-docker.sh domain=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`

or

`./initialize-node.sh domain=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`

### Start the server

To run the server, simply run the command as displayed by the initialization script.

Example:

`node main key=... cert=... domain=... defaultPort=... restoreWIF=... restoreToken=...`

or


### Endpoints API documentation

The detailed documentation of the backend kit API is described in the swagged.yaml file contained in this repository.
 This file can be imported at [editor.swagger.io](https://editor.swagger.io/).
 The documentation is exposed on the `/documentation` endpoint.
 