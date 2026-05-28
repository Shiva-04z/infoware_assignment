
import { Router } from 'express';
import prisma from '../../config/database.config';
import qdrantClient from '../../config/qdrant.config';
import redisClient from '../../config/redis.config';

const router = Router();

router.get('/health', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: 'unknown',
            qdrant: 'unknown',
            redis: 'unknown',
        },
    };

    // Check database
    try {
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = 'up';
    } catch (error) {
        health.services.database = 'down';
        health.status = 'unhealthy';
    }

    // Check Qdrant
    try {
        await qdrantClient.getCollections();
        health.services.qdrant = 'up';
    } catch (error) {
        health.services.qdrant = 'down';
        health.status = 'unhealthy';
    }

    // Check Redis
    try {
        await redisClient.ping();
        health.services.redis = 'up';
    } catch (error) {
        health.services.redis = 'down';
        health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
});

export default router;