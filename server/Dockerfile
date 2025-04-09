# Use an official Node.js image
FROM node:20

# Set working directory
WORKDIR /server

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Generate Prisma client and compile TypeScript
RUN npm run prisma:generate
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Apply Prisma migrations and start the server
CMD npm run prisma:migrate && npm run start
