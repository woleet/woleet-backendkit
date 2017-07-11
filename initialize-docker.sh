#!/usr/bin/env bash

function get_docker_id()
{
echo $(docker ps | grep woleet-backend-kit | cut -d' ' -f1)
}

RUNNING=$(get_docker_id)

if [ ${#RUNNING} -gt 0 ];
    then
        echo "Docker is already running with this image, to stop it use: 'docker stop ${RUNNING}'";
        exit;
fi

docker build -t woleet-backend-kit .

VOLUME=/usr/src/app/volume

#Getting parameters
while [ $# -gt 0 ]; do
  case "$1" in
    key=*)
      KEY="${1#*=}";;
    cert=*)
      CRT="${1#*=}";;
    identityURL=*)
      URL="${1#*=}";;
    signaturePort=*)
      SGP="${1#*=}";;
    --regen-token)
      TOKEN_REGEN_PARAM="forceRegenToken=1";;
    --regen-wif)
      WIF_RESTORATION_PARAM="forceRegenWIF=1";;
    *)
      printf "* Error: Invalid argument: "$1"\n"
      exit 1
  esac
  shift
done

if [ ! -z ${SGP} ];
    then
        SGP_BINDING="-p ${SGP}:5443";
        SGP_PARAM="signaturePort=5443";
fi

# if --regen-wif option is set we do not offer to manually set the private key
if [ ${#WIF_RESTORATION_PARAM} -eq 0 ]; then
    read -r -p 'Would you like to manually set your private key? [y/N]' response
    case "$response" in
        [yY][eE][sS]|[yY]) RESTORE=1;;
        *);;
    esac

    #if RESTORE option
    if [ ! -z ${RESTORE} ]; then
        echo '  Enter your WIF key:'
        read -r WIF_RESTORATION
        WIF_RESTORATION_PARAM="restoreWIF=$WIF_RESTORATION"
    fi
fi

docker run  \
    -p 443:4443 ${SGP_BINDING} \
    -v ${KEY}:${VOLUME}/key  \
    -v ${CRT}:${VOLUME}/cert \
    --rm -d woleet-backend-kit ${SGP_PARAM} ${WIF_RESTORATION_PARAM} ${TOKEN_REGEN_PARAM} key=${VOLUME}/key cert=${VOLUME}/cert identityURL=${URL}

#############################################################
#  Since here, we are done, just showing keys to the user   #
#############################################################

DOCKER_ID=$(get_docker_id)
wif=""
token=""
address=""

function get_string()
{
docker logs ${DOCKER_ID} 2>&1 | grep -a --text $1 | tail -1 | cut  -d' ' -f2
}

# Getting generated/restored keys
while true
do
   wif=$( get_string "WIF:" )
   token=$( get_string "Token:" )
   address=$( get_string "Address:" )
   if [ "$wif" == "" ] || [ "$token" == "" ]
   then
        sleep 1s
    else
        break
   fi
done

# if RESTORE is set, we do not tell the user to backup it
if [ -z ${RESTORE} ]; then
    echo 'A new key pair has been generated, please carefully write it down:'
    read -p "${wif} (Press any key to continue)" -n1 -s
    echo -en "\r\033[K"

    wif_6_last=${wif:${#wif}-6}
    wif_confirm=''
    wif_tries=0

    while [ "$wif_6_last" != "$wif_confirm" ]; do
        if [ "$wif_tries" -ne "0" ]; then
           echo -n 'Invalid confirmation; '
        fi
        ((wif_tries++))
        echo 'Please type the 6 last characters of the generated WIF:'
        read -r wif_confirm
    done
fi

echo 'A new access token has been generated, please carefully write it down:'

read -p "${token} (Press any key to continue)" -n1 -s
echo -en "\r\033[K"

echo "All set! Your address (public key) is ${address}"

wif=""
token=""
address=""

#./initialize-docker.sh identityURL=localhost key=~/Documents/WOLEET/woleet-ci/local/ssl/localhost.key cert=~/Documents/WOLEET/woleet-ci/local/ssl/localhost.crt