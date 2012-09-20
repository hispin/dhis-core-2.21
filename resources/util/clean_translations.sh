#!/bin/bash
#This script should clean all translation files in a given directory
#removing all non-translated keys, and any legacy keys in the translation files.
isNotSet() {
    if [[ ! ${!1} && ${!1-_} ]]
    then
        return 1
    fi
}

if [[ $# -lt 1 ]]; then
  echo "Usage: $0  directory"
  exit 1
fi

DIR=$1 #The directory should be the first argument
#TODO Test the directories are writable

# save and change IFS
OLDIFS=$IFS
IFS=$'\n'

fileArray=($(find $DIR -type f -name "i18n_*_*.properties"))

# restore it
IFS=$OLDIFS

# get length of the files to iterate over
tLen=${#fileArray[@]}

#Find the template file
TEMPLATE=($(find $DIR -name 'i18n*.properties' -type f | grep -P "i18n_(module|global).properties"))
TEMPLATE_OUT="$(mktemp)"
grep -Ev '^#' $TEMPLATE | sed '/^\r/d' | grep -Ev '^$'| sort > $TEMPLATE_OUT

declare -A template_array
while IFS='=' read -r key val; do
        [[ $key = '#'* ]] && continue
        template_array["$key"]="$val"
done < $TEMPLATE_OUT

for (( i=0; i<${tLen}; i++ ));
        do

        declare -A trans_array
        TRANS_FILE=${fileArray[$i]}
        TRANS_OUT="$(mktemp)"
        #make a backup copy
        cp $TRANS_FILE $TRANS_FILE.bak
        grep -Ev '^#' $TRANS_FILE | sed '/^\r/d' | grep -Ev '^$'| sort > $TRANS_OUT

        while IFS='=' read -r key val; do
        [[ $key = '#'* ]] && continue
        trans_array["$key"]="$val"
        done < $TRANS_OUT

        echo -n "" > $TRANS_FILE

        for key in "${!template_array[@]}"; do

        isNotSet trans_array[${key}]
        if [ $? -ne 1  ];then
                translation=${trans_array[$key]}
                template=${template_array[$key]}
                if [[ *"$translation"* != *"$template"* ]];then
                        echo "$key=$translation" >> ${TRANS_FILE};
                fi
        fi
        done
echo "Cleaned $TRANS_FILE"
rm $TRANS_OUT
unset trans_array
done

rm $TEMPLATE_OUT

