import {
    Request,
    Response,
    NextFunction,
} from 'express';

import prisma from '../config/database.config';

import {
    verifyAuthToken,
} from '../utils/jwt.utils';

import {
    errorResponse,
} from '../utils/response.utils';

export const tenantAuthMiddleware =
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { tenantId } =
                req.params;

            const token =
                req.headers.authorization?.replace(
                    'Bearer ',
                    '',
                );

            if (!tenantId) {
                return errorResponse(
                    res,
                    400,
                    'Tenant ID is required',
                );
            }

            if (!token) {
                return errorResponse(
                    res,
                    401,
                    'Authorization token is required',
                );
            }

            const decoded =
                verifyAuthToken(
                    token,
                ) as {
                    tenantId: string;
                    email: string;
                };

            if (
                decoded.tenantId !==
                tenantId
            ) {
                return errorResponse(
                    res,
                    403,
                    'Invalid tenant access',
                );
            }

            const tenant =
                await prisma.tenant.findFirst({
                    where: {
                        id: tenantId,
                        email:
                        decoded.email,
                        status: 'ACTIVE',
                    },
                });

            if (!tenant) {
                return errorResponse(
                    res,
                    403,
                    'Invalid tenant',
                );
            }

            (
                req as Request & {
                    tenant: typeof tenant;
                }
            ).tenant = tenant;

            next();
        } catch (error) {
            console.error(
                'Auth error:',
                error,
            );

            return errorResponse(
                res,
                401,
                'Authentication failed',
                error,
            );
        }
    };


export const AdminAuthMiddleware =
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {

            const token =
                req.headers.authorization?.replace(
                    'Bearer ',
                    '',
                );

            if (!token) {
                return errorResponse(
                    res,
                    401,
                    'Authorization token is required',
                );
            }

            const decoded =
                verifyAuthToken(
                    token,
                ) as {
                    tenantId: string;
                    email: string;
                    role: string;
                };

            if (
                decoded.role !==
                "Admin"
            ) {
                return errorResponse(
                    res,
                    403,
                    'Invalid tenant access',
                );
            }

            const tenant =
                await prisma.tenant.findFirst({
                    where: {
                        id: decoded.tenantId,
                        email:
                        decoded.email,
                        status: 'ACTIVE',
                    },
                });

            if (!tenant) {
                return errorResponse(
                    res,
                    403,
                    'Invalid tenant',
                );
            }

            (
                req as Request & {
                    tenant: typeof tenant;
                }
            ).tenant = tenant;

            next();
        } catch (error) {
            console.error(
                'Auth error:',
                error,
            );

            return errorResponse(
                res,
                401,
                'Authentication failed',
                error,
            );
        }
    };