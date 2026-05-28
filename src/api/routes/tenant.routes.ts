

import { Router } from 'express';
import { validateBody,validateQuery,validateParams } from '../../middlewares/validation.middleware';


import {
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

export const FETCH_TENANT_ENDPOINT =
    '/tenant/:tenantId';

export const LOGIN_TENANT_ENDPOINT =
    '/tenant/login';

export const REFRESH_AUTH_TOKEN_ENDPOINT =
    '/tenant/refresh-token';

router.post(
    CREATE_TENANT_ENDPOINT,
    validateBody(createTenantSchema),
    createTenant,
);
router.post(
    LOGIN_TENANT_ENDPOINT,
    validateBody(tenantLoginSchema),
    loginTenant,
);

router.post(
    REFRESH_AUTH_TOKEN_ENDPOINT,
    validateBody(refreshAuthTokenSchema),
    refreshAuthToken,
);

router.get(
    FETCH_TENANT_ENDPOINT,
    validateParams(fetchTenantSchema),
    fetchTenant as any,
);

export default router;