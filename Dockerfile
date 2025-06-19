FROM node:16
RUN apt-get update && apt-get install -y openjdk-17-jre
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
