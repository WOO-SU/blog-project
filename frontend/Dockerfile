FROM node:20-alpine

WORKDIR /app

# Copy package files first to cache dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port React usually runs on
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]