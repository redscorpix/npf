#!/bin/bash
cd "$(dirname "$0")"

if [ -d ".tmp" ]; then
	rm -rf ".tmp"
fi

mkdir ".tmp"
cd ".tmp"

# PLOVR
if [ ! -f "../bin/plovr.jar" ]; then
	hg clone https://bitbucket.org/andreypopp/plovr
	(cd "plovr" && ant jar)
    if [! -d "../bin" ]; then
    	mkdir "./bin"
    fi
	mv ./plovr/build/plovr.jar ../bin/
fi

rm -rf ".tmp"
