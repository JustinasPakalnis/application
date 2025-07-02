FROM node:20.9.0-bullseye-slim

WORKDIR /app
COPY package*.json ./
RUN npm install



COPY ./ ./

RUN npx prisma generate
RUN npx prisma migrate dev --name init

EXPOSE 3000

CMD ["npm", "run", "dev"]
