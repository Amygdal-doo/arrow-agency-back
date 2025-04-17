#!/bin/bash

set -e

echo "Downloading Chromium..."
curl -sSL https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1181205/chrome-linux.zip -o /tmp/chromium.zip

echo "Unzipping with Node..."
node << 'EOF'
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const unzipper = require('unzipper');

const zipPath = '/tmp/chromium.zip';
const extractPath = '/tmp';

pipeline(
  fs.createReadStream(zipPath),
  unzipper.Extract({ path: extractPath }),
  (err) => {
    if (err) {
      console.error('Unzip failed:', err);
      process.exit(1);
    } else {
      console.log('Unzip successful.');
    }
  }
);
EOF

echo "Moving to /usr/bin/chromium-browser..."
mkdir -p /usr/bin

# Move the extracted Chromium folder to /usr/bin
mv /tmp/chrome-linux /usr/bin/chromium

# Create symbolic link for chromium-browser
ln -s /usr/bin/chromium/chrome /usr/bin/chromium-browser

# Set executable permissions on the Chromium binary
chmod +x /usr/bin/chromium/chrome
chmod +x /usr/bin/chromium-browser

echo "Chromium installed!"
