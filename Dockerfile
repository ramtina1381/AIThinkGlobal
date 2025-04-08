# Use the official Node.js image
FROM node:20

# Create and set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Build your app if needed (if you have a build step)
# RUN npm run build

# Set the port
EXPOSE 8080

# Run the app
CMD ["node", "server.js"]