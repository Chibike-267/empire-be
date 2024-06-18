# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the application (if you have a build step)
RUN yarn build

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["yarn", "start"]
