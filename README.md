# Woleet backend kit

The Woleet backend kit facilitates the integration of Woleet's
 [signature anchoring](https://medium.com/@woleet/beyond-data-anchoring-bee867d9be3a)
  functionality into your backend workflow, by providing all you need for your backend to easily:
 * manage its bitcoin identity (ie. its public bitcoin address and associated private key)
 * sign some data using its bitcoin identity
 * expose and prove to the world its bitcoin identity

The Woleet backend kit is made of:
 * an initialization script allowing to generate or restore the bitcoin identity and the API token of the backend kit
 * a Node.js server exposing the REST API of the backend kit
 
The backend kit API exposes two public endpoints that need to be accessible from outside your backend:
 * `/identity` allows to verify that your backend effectively owns its claimed bitcoin address
 * `/documentation` allows to display the Swagger documentation of the backend kit API.

Additionally, the backend kit API exposes one private endpoint that need to be accessible only from inside your backend:
* `/signature` allows to sign some data using its bitcoin address (an API token is used to protect this endpoint)

## Prerequisites

To install the Node.js server, you will need:
* a web domain (eg. mycompany.com) used to expose the public endpoints of the backend kit API
* a valid (not self signed) TLS certificate (and its associated key) associated to the web domain

Node.js needs to be installed on your system.
To run the Node.js server into a Docker container, you also need to install Docker on your system. 

## Install the server

Clone the project (`git clone https://github.com/woleet/woleet-backendkit.git`) or download `https://github.com/woleet/woleet-backendkit/archive/master.zip` and uncompress it.

## Initialize the server

Go to the installation directory.

Choose which version of the initialization script you want to use: 2 versions are provided, initialize-docker.sh and initialize-node.sh, depending on whether you want to run the Node.js server directly or embed it into a Docker container.

Run the initialization script with the following parameters:
- cert=<PATH_TO_CERTIFICATE> path to your certificate.
- key=<PATH_TO_CERTIFICATE_KEY> path to your certificate's key.
- domain=<YOUR_DOMAIN> (to expose the API on "https://<YOUR_DOMAIN>/").
- signaturePort=<SIGNATURE_PORT> (optional, default 443), set it if you want to expose the "/signature" endpoint on an other port.
- defaultPort=<IDENTITY_PORT> (optional, default: 443), set it if you want to expose the "/identity" endpoint on an specific port.
- --cluster (optional), set it to use node [cluster](https://nodejs.org/docs/latest/api/cluster.html#cluster_cluster) mode to handle a higher load.

The initialization script will:
- Ask you if you want to restore a private key (WIF) or generate a new one.
- Ask you if you want to restore an API token or generate a new one.
- Display your private key (WIF), your API token and your bitcoin address (public key).
- Display the command line to use to run the Node.js server.

**WARNING: The private key (WIF) is required to restore your bitcoin identity in case of system loss, and the API token is required to use the "/signature" endpoint.
Be careful to write down and backup these 2 information carefully in order to restore your identity and service in case of server loss.**

Example:

`./initialize-docker.sh domain=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`

or

`./initialize-node.sh domain=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`

## Start the server

To run the server, simply run the command as displayed by the initialization script.

Example:

`node main key=... cert=... domain=... defaultPort=... restoreWIF=... restoreToken=...`

or

`docker run -p 443:443 -v ...:/usr/src/app/volume/key -v ...:/usr/src/app/volume/cert --rm -d woleet-backend-kit key=/usr/src/app/volume/key cert=/usr/src/app/volume/cert domain=... restoreWIF=... restoreToken=...=`

## Endpoints API documentation

The detailed documentation of the backend kit API is described in the swagged.yaml file contained in this repository.
 This file can be imported at [editor.swagger.io](https://editor.swagger.io/).
 The documentation is exposed on the `/documentation` endpoint.
 
