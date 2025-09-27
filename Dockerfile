# Dockerfile

# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the Next.js app 
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3001

# Start the app
CMD ["npm", "start"]