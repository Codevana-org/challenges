# Use Node.js LTS base image
FROM node:18

# Set working directory
WORKDIR /app/

# Copy app files
COPY chall .
COPY tests .

# Install dependencies
RUN npm install

# Expose app port
EXPOSE 3000

# Default command is overridden in docker-compose
CMD ["npm", "start"]
