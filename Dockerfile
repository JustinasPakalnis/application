FROM node:20.9.0-alpine AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

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
RUN apk add --no-cache curl

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "deploy"]
