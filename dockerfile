# Use a base image with all Puppeteer deps
FROM alpine:3.21

# Puppeteer dependencies
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxss1 \
  libxtst6 \
  xdg-utils \
  --no-install-recommends \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN yarn build

# Expose Puppeteer Chromium path explicitly in environment
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Tell Puppeteer not to download Chromium (you’ll provide your own)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Optional: install Chromium from a reliable Debian repo
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

# Start the app
CMD ["yarn", "start:prod"]
