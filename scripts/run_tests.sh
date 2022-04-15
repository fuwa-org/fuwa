#!/bin/bash

# if we're being executed inside the scripts directory,
# then go up to the root directory
if [[ "$PWD" =~ "scripts" ]]; then
  cd ..
fi

# load environment variables
source .env

node test/index.js