#!/usr/bin/env bash

MODE=node
DEFAULT_PORT=443

# Install dependencies
npm i --silent

source configure.sh

if [ ! -z ${SIGNATURE_PORT} ];
then
    SIGNATURE_PORT_PARAM="signaturePort=${SIGNATURE_PORT}";
fi

echo node main \
    key=${KEY} cert=${CERT} domain=${URL} \
    defaultPort=${DEFAULT_PORT} \
    ${SIGNATURE_PORT_PARAM} ${CLUSTER_PARAM} \
    restoreWIF=${restoreWIF} restoreToken=${restoreToken}
