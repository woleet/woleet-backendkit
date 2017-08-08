#!/usr/bin/env bash

MODE=docker
DEFAULT_PORT=443
VOLUME=/usr/src/app/volume

# Building image
docker build -t woleet-backend-kit .

source configure.sh

if [ ! -z ${SGP} ];
then
    SGP_BINDING="-p ${SGP}:5443";
    SGP_PARAM="signaturePort=5443";
fi

echo docker run  \
    -p ${DEFAULT_PORT}:443 ${SGP_BINDING} \
    -v ${KEY}:${VOLUME}/key  \
    -v ${CRT}:${VOLUME}/cert \
    --rm -d woleet-backend-kit \
    ${SGP_PARAM} ${WIF_RESTORATION_PARAM} \
    ${TOKEN_REGEN_PARAM} ${CLUSTER_PARAM}\
    key=${VOLUME}/key cert=${VOLUME}/cert domain=${URL} \
    restoreWIF=${restoreWIF} restoreToken=${restoreToken}
