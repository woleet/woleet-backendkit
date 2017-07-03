#!/usr/bin/env bash

RUNNING=$(docker ps | grep woleet-backend-kit | cut -d' ' -f1)

if [ ${#RUNNING} -gt 0 ];
    then
        echo "Docker is already running with this image, to stop it use : 'docker stop ${RUNNING}'";
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
    *)
      printf "* Error: Invalid argument: "$1"\n"
      exit 1
  esac
  shift
done

if [ ! -z ${SGP} ];
    then
        SGP_BINDING="-p ${SGP}:553";
        SGP_PARAM="-e signaturePort=553";
fi

#echo run -p 443:443 ${SGP_BINDING} ${SGP_PARAM} -e key=${VOLUME}/key -v ${KEY}:${VOLUME}/key -e cert=${VOLUME}/cert -v ${CRT}:${VOLUME}/cert -e identityURL=${URL} --rm -d woleet-backend-kit

DOCKER_ID=$(docker run -p 443:443 ${SGP_BINDING} ${SGP_PARAM}   \
    -e key=${VOLUME}/key -v ${KEY}:${VOLUME}/key                \
    -e cert=${VOLUME}/cert -v ${CRT}:${VOLUME}/cert             \
    -e identityURL=${URL} --rm -d woleet-backend-kit            )

SECRET=$(docker exec -it ${DOCKER_ID} /bin/cat /usr/src/app/data)

wif=$( echo ${SECRET} | cut -d':' -f1) # wif
jwt=$( echo ${SECRET} | cut -d':' -f2) # token

###########################################################
#                                                         #
#   Since here, wre done, just showing keys to the user   #
#                                                         #
###########################################################

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

echo 'A new access token has been generated, please carefully write it down:'

read -p "${jwt} (Press any key to continue)" -n1 -s
echo -en "\r\033[K"

echo 'All set!'

#./initialize.sh identityURL=localhost key=~/Documents/WOLEET/woleet-ci/local/ssl/localhost.key cert=~/Documents/WOLEET/woleet-ci/local/ssl/localhost.crt