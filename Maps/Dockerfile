# Use Node.js base image
FROM node:alpine


# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your server listens on (change if needed)
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
