import { Router } from 'express';

import { tenantAuthMiddleware } from '../../middlewares/auth.middleware';
import { identityRateLimiter } from '../../middlewares/rate.limit.middleware';;
import { processQuery } from '../controllers/query.controller';
import { processQuerySchema } from '../../validators/query.validator';

import { validateBody,validateQuery,validateParams } from '../../middlewares/validation.middleware';

const router = Router();

export const TENANT_BASE_ENDPOINT = '/:tenantId';
export const QUERY_ENDPOINT = '/:tenantId/query';

router.use(TENANT_BASE_ENDPOINT, tenantAuthMiddleware);

router.post(
    QUERY_ENDPOINT,
    identityRateLimiter,
    validateBody(processQuerySchema),
    processQuery as any,
);

export default router;