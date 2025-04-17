#!/bin/bash

# Railway koristi apt-get, ali ovo ignoriramo lokalno
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "Installing Chromium on Linux..."
  apt-get update
  apt-get install -y chromium-browser
else
  echo "Skipping Chromium install on macOS (handled manually via brew)"
fi
