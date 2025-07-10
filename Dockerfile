FROM node:20.9.0-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20.9.0-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
ENV NODE_ENV=production
RUN apk add --no-cache curl

EXPOSE 3000

CMD ["node", "build/server/index.js"]
