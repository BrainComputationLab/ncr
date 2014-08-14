#!/bin/bash

# create and enter virtualenv
if [ ! -d ".env" ]; then
  virtualenv .env
fi
. .env/bin/activate

# required dirs
if [ ! -d "logs" ]; then
  mkdir logs
fi

# install requirements
pip install -r requirements-dev.txt
pip install -r requirements.txt
