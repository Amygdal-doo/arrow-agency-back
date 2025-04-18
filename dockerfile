# Use a base image with all Puppeteer deps
FROM alpine:3.21

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
