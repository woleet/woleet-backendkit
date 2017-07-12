#!/usr/bin/env bash

OUT_FILE=.output.log
ERR_FILE=.errors.log
PID_FILE=backendkit.pid

echo '' > ${OUT_FILE}
echo '' > ${ERR_FILE}

# Checking if running
if [ -f "$HOME/.forever/pids/$PID_FILE" ]; then
   PID=$(cat $HOME/.forever/pids/${PID_FILE})
   echo "Backend kit is already running, to stop it use: 'forever stop ${PID}'";
   exit;
fi

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

# Installing dependencies
npm i --silent

if [ ! -z ${SGP} ];
    then
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

forever -o ${OUT_FILE} -e ${ERR_FILE} --pidFile ${PID_FILE} --minUptime 3000 --spinSleepTime 3000 start main.js ${SGP_PARAM} ${WIF_RESTORATION_PARAM} ${TOKEN_REGEN_PARAM} key=${KEY} cert=${CRT} identityURL=${URL}

#############################################################
#  Since here, we are done, just showing keys to the user   #
#############################################################

wif=""
token=""
address=""

function get_string()
{
cat ${OUT_FILE} 2>&1 | grep -a --text $1 | tail -1 | cut  -d' ' -f2
}

# Getting generated/restored keys
while true
do
   wif=$( get_string "WIF:" )
   token=$( get_string "Token:" )
   address=$( get_string "Address:" )
   echo '' > ${OUT_FILE}
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