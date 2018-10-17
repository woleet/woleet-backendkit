#!/usr/bin/env bash

MODE=docker
DEFAULT_PORT=443
VOLUME=/usr/src/app/volume

# Building image
docker build -t woleet-backend-kit .

source configure.sh

if [ ! -z ${SIGNATURE_PORT} ];
then
    SIGNATURE_PORT_BINDING="-p ${SIGNATURE_PORT}:5443";
    SIGNATURE_PORT_PARAM="signaturePort=5443";
fi

echo docker run  \
    -p ${DEFAULT_PORT}:443 ${SIGNATURE_PORT_BINDING} \
    -v ${KEY}:${VOLUME}/key  \
    -v ${CERT}:${VOLUME}/cert \
    --rm -d woleet-backend-kit \
    ${SIGNATURE_PORT_PARAM} ${CLUSTER_PARAM}\
    key=${VOLUME}/key cert=${VOLUME}/cert domain=${URL} \
    restoreWIF=${restoreWIF} restoreToken=${restoreToken}
