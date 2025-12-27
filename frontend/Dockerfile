FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# CRA uses port 3000 by default
EXPOSE 3000

# WDS_SOCKET_PORT=0 prevents common "WebSocket connection failed" errors in Docker
ENV WDS_SOCKET_PORT=0

CMD ["npm", "start"]