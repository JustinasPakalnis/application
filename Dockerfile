FROM node:20.9.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apk add --no-cache curl
COPY ./ ./

RUN npm run build
EXPOSE 3000

CMD ["node", "build/server/index.js"]
