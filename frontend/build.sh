#!/bin/bash

# Ensure we're using the correct Node version
export NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
npm install

# Use npx to run react-scripts to avoid permission issues
npx react-scripts build

# Exit with the status of the build command
exit $?