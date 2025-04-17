# Use a base image with all Puppeteer deps
FROM alpine:3.21

# Puppeteer deps
RUN apt-get update && apt-get install -y \
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
  ca-certificates \
  wget \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy rest of the app
COPY . .

# Build the NestJS app
RUN yarn run build

# Expose port (optional if set via Railway)
EXPOSE 3000

# Start the app
CMD ["yarn", "run", "start:prod"]
