#!/usr/bin/env bash

MODE=node
DEFAULT_PORT=443

# Install dependencies
npm i --silent

source configure.sh

if [ ! -z ${SGP} ];
then
    SGP_PARAM="signaturePort=$SGP";
fi

echo node main \
    key=${KEY} cert=${CRT} domain=${URL} \
    defaultPort=${DEFAULT_PORT} \
    ${SGP_PARAM} ${WIF_RESTORATION_PARAM} \
    ${TOKEN_REGEN_PARAM} ${CLUSTER_PARAM} \
    restoreWIF=${restoreWIF} restoreToken=${restoreToken}
