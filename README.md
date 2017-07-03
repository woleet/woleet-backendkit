## Woleet backend kit

##Prerequisites

- Docker is installed on your system. 
- A web domain.
- An ssl certificate (certificate and key) for your domain.

##Installation

Clone the project: git clone git@github.com:woleet/woleet-backend-kit.git` or download https://github.com/woleet/woleet-backend-kit/archive/master.zip and uncompress it.

##First run

Simply run the "initialise.sh" script with the following parameters:
- cert=<PATH_TO_CERTIFICATE> path to your certificate.
- key=<PATH_TO_CERTIFICATE_KEY> path to your certificate's key.
- identityURL=<SERVER_IDENTITY_URL> (needs to match with "https://YOUR-DOMAIN/identity").
- signaturePort=<SIGNATURE_PORT> (optional), useful if you want to expose the "/signature" endpoint on an other port.

This script is interactive and will display your private key and your access token to access the "/signature" endpoint.