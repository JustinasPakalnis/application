import Redis from "ioredis";

const redisClient = new Redis({
  port: 6379,
  host: process.env.CACHE_HOST,
  password: process.env.CACHE_PASSWORD,
});

export default redisClient;
