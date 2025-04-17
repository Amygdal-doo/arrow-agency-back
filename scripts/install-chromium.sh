#!/bin/bash

set -e

echo "Downloading Chromium..."
wget -q https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1181205/chrome-linux.zip -O /tmp/chromium.zip

echo "Extracting Chromium..."
unzip -q /tmp/chromium.zip -d /tmp/

echo "Moving to /usr/bin/chromium-browser..."
mkdir -p /usr/bin
mv /tmp/chrome-linux /usr/bin/chromium
ln -s /usr/bin/chromium/chrome /usr/bin/chromium-browser

echo "Chromium installed!"
