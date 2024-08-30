# Use an official Node.js runtime as a parent image
FROM node:20-alpine

ARG API_BASE_URL

# Set the working directory
WORKDIR /app

# Copy package files
COPY package-lock.json package.json ./

# Install project dependencies using npm
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

RUN touch .env.production


RUN echo "VITE_API_URL=${API_BASE_URL}" > .env.production

# Build the Vite project
RUN npm run build

# Install serve to serve the application on port 80
RUN npm install -g serve

# Expose port 80 to the outside
EXPOSE 80

# Command to serve the app using `serve`
CMD ["serve", "-s", "dist", "-l", "80"]
