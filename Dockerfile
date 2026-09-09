FROM node:20-alpine

WORKDIR /app

# Copy package definitions
COPY package*.json ./

# Install dependencies using standard npm
RUN npm install

# Copy source files
COPY . .

# Build frontend and server
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.cjs"]
