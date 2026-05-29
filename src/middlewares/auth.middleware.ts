import {
    Request,
    Response,
    NextFunction,
} from 'express';

import {TenantParams} from '../models/tenant.request.types'

import prisma from '../config/database.config';

import {
    verifyAuthToken,
} from '../utils/jwt.utils';

import {
    errorResponse,
} from '../utils/response.utils';

export const AuthMiddleware =
    async (
        req: Request<TenantParams,any,any>,
        res: Response,
        next: NextFunction,
    ) => {
        try {

            const tenantId = req.params.tenantId;
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
                    role: string;
                };

            if (decoded.role == 'User') {
                if (
                    decoded.tenantId !==
                    tenantId as String
                ) {
                    return errorResponse(
                        res,
                        403,
                        'Invalid tenant access',
                    );
                }
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

            if (tenant.id != null && tenant.id != req.params.tenantId) {
                const targetTenant = await prisma.tenant.findFirst(
                    {
                        where: {
                            id: tenantId
                        }
                    }
                );
                if (!targetTenant) {
                    return errorResponse(res, 404, 'No Target Exist');
                }
            }


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
