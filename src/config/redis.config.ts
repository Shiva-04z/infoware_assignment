import { createClient } from 'redis';

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,

    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        family:4,
        tls: false,
        connectTimeout: 10000,

        reconnectStrategy: (retries) => {
            return Math.min(retries * 100, 3000);
        },
    },
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('✅ Redis connected');
});

export const connectRedis = async () => {
    await redisClient.connect();
};

export default redisClient;