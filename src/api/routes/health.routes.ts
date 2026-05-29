import {Router, Request, Response} from 'express';
import prisma from '../../config/database.config';
import qdrantClient from '../../config/qdrant.config';
import redisClient from '../../config/redis.config';
import {successResponse} from "../../utils/response.utils";
import {ipRateLimiter} from "../../middlewares/rate.limit.middleware";

const router = Router();

const gethealth = async (req: Request, res: Response) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: 'unknown',
            qdrant: 'unknown',
            redis: 'unknown',
        },
    };
    try {
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = 'up';
    } catch (error) {
        health.services.database = 'down';
        health.status = 'unhealthy';
    }

    try {
        await qdrantClient.getCollections();
        health.services.qdrant = 'up';
    } catch (error) {
        health.services.qdrant = 'down';
        health.status = 'unhealthy';
    }

    try {
        await redisClient.ping();
        health.services.redis = 'up';
    } catch (error) {
        health.services.redis = 'down';
        health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    return successResponse(res, statusCode, "Health Check Successful", health)
}

router.get('/health', ipRateLimiter, gethealth);
export default router;