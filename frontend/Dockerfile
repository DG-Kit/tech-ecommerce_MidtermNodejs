FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the build
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]