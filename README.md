## Woleet backend kit

This server aims to provide an easy way to sign a hash and proving that you are the corresponding signee on demand by providing two endpoints:
    
`/identity` let **anyone** verify that you own the private key corresponding to your address. 
      
`/signature` let **you** (and only you) sign a hash.

### Prerequisites

In order to run this server you will need:
- A web domain.
- An ssl certificate (certificate and key) for your domain.
- For a docker usage: Docker is installed on your system. 
- For a node-only usage: "forever" is globally installed on your system (npm i -g forever`)

### Installation

Clone the project: git clone git@github.com:woleet/woleet-backendkit.git` or download https://github.com/woleet/woleet-backendkit/archive/master.zip and uncompress it.

### First run with the helper script initialize-docker.sh or initialize-node.sh 

Simply run the "initialise-[node|docker`].sh" script with the following parameters:
- cert=<PATH_TO_CERTIFICATE> path to your certificate.
- key=<PATH_TO_CERTIFICATE_KEY> path to your certificate's key.
- identityURL=<YOUR-DOMAIN> (in order to match with "https://<YOUR-DOMAIN>/identity").
- signaturePort=<SIGNATURE_PORT> (optional), useful if you want to expose the "/signature" endpoint on an other port.

This script is interactive and will display your private key and your access token to access the "/signature" endpoint.

Example:<br>
`./initialize-docker.sh identityURL=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`
<br>or:<br>
`./initialize-node.sh identityURL=localhost key=~/ssl/selfsigned.key cert=~/ssl/selfsigned.crt`

### Endpoints description:

Detailed description of the API is described in the swagged.yaml file contained in this repository it can be imported at [editor.swagger.io](https://editor.swagger.io/).