import { Router } from 'express';
import { validateBody,validateQuery,validateParams } from '../../middlewares/validation.middleware';
import {ipRateLimiter,identityRateLimiter} from '../../middlewares/rate.limit.middleware'
import {AuthMiddleware} from '../../middlewares/auth.middleware'

import {
    createAdmin,
    createTenant,
    fetchTenant,
    refreshAuthToken,
    loginTenant
} from '../controllers/tenant.controller';


import {
    createTenantSchema,
    refreshAuthTokenSchema,
    fetchTenantSchema,
    tenantLoginSchema
} from '../../validators/tenant.validator';

const router = Router();

export const CREATE_TENANT_ENDPOINT =
    '/tenant';

export const CREATE_ADMIN_ENDPOINT =
    '/admin';

export const FETCH_TENANT_ENDPOINT =
    '/tenant/:tenantId';

export const LOGIN_TENANT_ENDPOINT =
    '/tenant/login';

export const REFRESH_AUTH_TOKEN_ENDPOINT =
    '/tenant/refresh-token';

router.post(
    CREATE_TENANT_ENDPOINT,
    validateBody(createTenantSchema),
    AuthMiddleware as any,
    identityRateLimiter,
    createTenant,
);

router.post(
    CREATE_ADMIN_ENDPOINT,
    validateBody(createTenantSchema),
    ipRateLimiter,
    createAdmin,
)
router.post(
    LOGIN_TENANT_ENDPOINT,
    validateBody(tenantLoginSchema),
    ipRateLimiter,
    loginTenant,
);

router.post(
    REFRESH_AUTH_TOKEN_ENDPOINT,
    validateBody(refreshAuthTokenSchema),
    ipRateLimiter,
    refreshAuthToken,
);

router.get(
    FETCH_TENANT_ENDPOINT,
    validateParams(fetchTenantSchema),
    AuthMiddleware as any,
    ipRateLimiter,
    fetchTenant as any,
);

export default router;