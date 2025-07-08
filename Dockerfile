FROM node:16-slim
RUN apt-get update && apt-get install -y openjdk-17-jre-headless
RUN curl -L -o plantuml-gplv2-1.2025.3.jar https://github.com/plantuml/plantuml/releases/download/v1.2025.3/plantuml-gplv2-1.2025.3.jar
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
