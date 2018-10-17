#!/usr/bin/env bash

function show_usage()
{
    echo "usage: ./initialize-$1 domain=example.com cert=<PATH_TO_CERTIFICATE> key=<PATH_TO_CERTIFICATE_KEY>"
}

function need_param()
{
    if [ -z "$2" ]
    then
        echo "Missing '$1' parameter"
        show_usage ${MODE}
        exit 1;
    fi
}

#############################################################
#  Getting parameters
#############################################################

while [ $# -gt 0 ]; do
  case "$1" in
    key=*)
      KEY="${1#*=}";;
    cert=*)
      CERT="${1#*=}";;
    domain=*)
      URL="${1#*=}";;
    signaturePort=*)
      SIGNATURE_PORT="${1#*=}";;
    defaultPort=*)
      DEFAULT_PORT="${1#*=}";;
    --cluster)
      CLUSTER_PARAM="cluster=1";;
    *)
      printf "Error: invalid argument '$1'\n"
      exit 1
  esac
  shift
done

need_param "domain" ${URL}
need_param "cert" ${CERT}
need_param "key" ${KEY}

#############################################################
#  Generate config
#############################################################

# manually set the private key
read -r -p "Would you like to manually set your private key? [y/N]" response
case "$response" in
    [yY][eE][sS]|[yY]) RESTORE=1;;
    *);;
esac

if [ ! -z ${RESTORE} ]; then
    echo "Enter your private key (WIF):"
    read -r WIF_RESTORATION
    WIF_RESTORATION_PARAM="restoreWIF=$WIF_RESTORATION"
fi

# manually set the api token
read -r -p "Would you like to manually set the api token? [y/N]" response
case "$response" in
    [yY][eE][sS]|[yY]) RESTORE_TOKEN=1;;
    *);;
esac

if [ ! -z ${RESTORE_TOKEN} ]; then
    echo "Enter the token you want to use to access the \"/signature\" endpoint:"
    read -r TOKEN_RESTORATION
    TOKEN_RESTORATION_PARAM="restoreToken=$TOKEN_RESTORATION"
fi

if [ ${MODE} == "docker" ]
then
  docker run --rm \
    --entrypoint sh \
    woleet-backend-kit -c "node generate-config.js\
    ${WIF_RESTORATION_PARAM}\
    ${TOKEN_RESTORATION_PARAM} \
    && cat generated-configuration" > generated-configuration

  source generated-configuration
else
node generate-config.js \
    ${WIF_RESTORATION_PARAM} \
    ${TOKEN_RESTORATION_PARAM} && \
    source generated-configuration
fi

#############################################################
#  Since here, we are done, just showing keys to the user
#############################################################

# if RESTORE is set, we do not tell the user to backup it
if [ -z ${RESTORE} ]; then
    echo "A new key pair has been generated, please carefully write down your private key (WIF):"
    read -p "${restoreWIF} (press any key to continue)" -n1 -s
    echo -en "\r\033[K"

    wif_6_last=${restoreWIF:${#restoreWIF}-6}
    wif_confirm=''
    wif_tries=0

    while [ "$wif_6_last" != "$wif_confirm" ]; do
        if [ "$wif_tries" -ne "0" ]; then
           echo -n "Invalid confirmation; "
        fi
        ((wif_tries++))
        echo "Please type the 6 last characters of the generated WIF:"
        read -r wif_confirm
    done
fi

if [ -z ${RESTORE_TOKEN} ]; then
    echo "A new API token has been generated, please carefully write it down (you will need it to access the '/signature' endpoint):"
    read -p "${restoreToken} (press any key to continue)" -n1 -s
    echo -en "\r\033[K"
fi

echo "All set! Your bitcoin address (public key) is '${address}'"
echo "To use this server in ${MODE} mode, run:"