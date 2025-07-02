FROM node:20.9.0-bullseye-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx prisma generate

COPY ./ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
