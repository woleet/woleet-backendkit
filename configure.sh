#!/usr/bin/env bash

function show_usage()
{
    echo "usage: ./initialize-$1 domain=example.com cert=<PATH_TO_CERTIFICATE> key=<PATH_TO_CERTIFICATE_KEY>"
}

function need_param()
{
    if [ -z "$2" ]
    then
        echo "Needs '$1' parameter"
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
      CRT="${1#*=}";;
    domain=*)
      URL="${1#*=}";;
    signaturePort=*)
      SGP="${1#*=}";;
    defaultPort=*)
      DEFAULT_PORT="${1#*=}";;
    --regen-token)
      TOKEN_REGEN_PARAM="forceRegenToken=1";;
    --regen-wif)
      WIF_RESTORATION_PARAM="forceRegenWIF=1";;
    --cluster)
      CLUSTER_PARAM="cluster=1";;
    *)
      printf "Error: invalid argument '$1'\n"
      exit 1
  esac
  shift
done

need_param "domain" ${URL}
need_param "cert" ${CRT}
need_param "key" ${KEY}

#############################################################
#  Generate config
#############################################################

# if --regen-wif option is set we do not offer to manually set the private key
if [ ${#WIF_RESTORATION_PARAM} -eq 0 ]; then
    read -r -p "Would you like to manually set your private key? [y/N]" response
    case "$response" in
        [yY][eE][sS]|[yY]) RESTORE=1;;
        *);;
    esac

    #if RESTORE option
    if [ ! -z ${RESTORE} ]; then
        echo "Enter your private key (WIF):"
        read -r WIF_RESTORATION
        WIF_RESTORATION_PARAM="restoreWIF=$WIF_RESTORATION"
    fi
fi

node generate-config.js ${SGP_PARAM} \
    ${WIF_RESTORATION_PARAM} \
    ${TOKEN_REGEN_PARAM} \
    domain=${URL} \
    && source generated-configuration
source generated-configuration

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

echo "A new access token has been generated (you will need it to access the '/signature' endpoint), please carefully write it down:"
read -p "${restoreToken} (press any key to continue)" -n1 -s
echo -en "\r\033[K"

echo "All set! Your bitcoin address (public key) is '${address}'"
echo "To use this server in ${MODE} mode, run:"