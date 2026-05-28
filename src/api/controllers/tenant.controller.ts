import {Request, Response} from 'express';
import {Role} from  '../../generated/prisma/enums'

import {v4 as uuidv4} from 'uuid';

import prisma from '../../config/database.config';
import bcrypt from 'bcryptjs';

import {CreateTenantRequest, FetchTenantRequest, LoginTenantRequest} from '../../models/tenant.request.types';


import {
    successResponse,
    errorResponse,
} from '../../utils/response.utils';

import {
    generateAuthToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../../utils/jwt.utils';






export const loginTenant = async (req: LoginTenantRequest, res: Response) => {
    try {
        const {email, password} = req.body;
        const tenant = await prisma.tenant.findUnique({where: {email}});
        if (!tenant) {
            return errorResponse(res, 400, 'tenant not found');
        }
        const isPasswordCorrect = await bcrypt.compare(password, tenant.password);
        if (!isPasswordCorrect) {
            return errorResponse(res, 401, 'wrong password');
        }
        const authToken =
            generateAuthToken({
                tenantId: tenant.id,
                email: tenant.email,
                role:tenant.role.toString()
            });

        const refreshToken =
            generateRefreshToken({
                tenantId: tenant.id,
            });

        return successResponse(
            res,
            200,
            'Tenant Logged In successfully',
            {
                id: tenant.id,
                name: tenant.name,
                email: tenant.email,
                status: tenant.status,
                role: tenant.role,
                authToken,
                refreshToken,
            },
        );
    } catch (error) {
        return errorResponse(res, 500, "Failed Login", error);
    }
}


export const createTenant = async (
    req: CreateTenantRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;


        const existingTenant =
            await prisma.tenant.findUnique({
                where: {
                    email,
                },
            });

        if (existingTenant) {
            return errorResponse(
                res,
                409,
                'Tenant with this email already exists',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const tenant =
            await prisma.tenant.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    status: 'ACTIVE',
                },
            });

        const authToken =
            generateAuthToken({
                tenantId: tenant.id,
                email: tenant.email,
                role: Role.User,
            });

        const refreshToken =
            generateRefreshToken({
                tenantId: tenant.id,
            });

        return successResponse(
            res,
            201,
            'Tenant created successfully',
            {
                id: tenant.id,
                name: tenant.name,
                email: tenant.email,
                status: tenant.status,
                authToken,
                refreshToken,
            },
        );
    } catch (error) {
        console.error(
            'Error creating tenant:',
            error,
        );

        return errorResponse(
            res,
            500,
            'Failed to create tenant',
            error,
        );
    }
};


export const createAdmin = async (
    req: CreateTenantRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;


        const existingTenant =
            await prisma.tenant.findUnique({
                where: {
                    email,
                },
            });

        if (existingTenant) {
            return errorResponse(
                res,
                409,
                'Tenant with this email already exists',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const tenant =
            await prisma.tenant.create({
                data: {
                    name,
                    email,
                    role:Role.Admin,
                    password: hashedPassword,
                    status: 'ACTIVE',
                },
            });

        const authToken =
            generateAuthToken({
                tenantId: tenant.id,
                email: tenant.email,
                role: Role.Admin,
            });

        const refreshToken =
            generateRefreshToken({
                tenantId: tenant.id,
            });

        return successResponse(
            res,
            201,
            'Tenant created successfully',
            {
                id: tenant.id,
                name: tenant.name,
                email: tenant.email,
                status: tenant.status,
                authToken,
                refreshToken,
            },
        );
    } catch (error) {
        console.error(
            'Error creating tenant:',
            error,
        );

        return errorResponse(
            res,
            500,
            'Failed to create tenant',
            error,
        );
    }
};


export const fetchTenant = async (
    req: FetchTenantRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const tenantId = req.params.tenantId;

        console.warn(tenantId);
        const tenant =
            await prisma.tenant.findUnique({
                where: {
                    id: tenantId,
                },
                include: {
                    _count: {
                        select: {
                            documents: true,
                            queries: true,
                        },
                    },
                },
            });

        if (!tenant) {
            return errorResponse(
                res,
                404,
                'Tenant not found',
            );
        }

        return successResponse(
            res,
            200,
            'Tenant fetched successfully',
            {
                id: tenant.id,
                name: tenant.name,
                email: tenant.email,
                status: tenant.status,
                createdAt: tenant.createdAt,
                documentCount:
                tenant._count.documents,
                queryCount:
                tenant._count.queries,
            },
        );
    } catch (error) {
        console.error(
            'Error fetching tenant:',
            error,
        );

        return errorResponse(
            res,
            500,
            'Failed to fetch tenant',
            error,
        );
    }
};


export const refreshAuthToken = async (
    req: Request,
    res: Response,
): Promise<Response | void> => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return errorResponse(
                res,
                400,
                'Refresh token is required',
            );
        }

        const decoded =
            verifyRefreshToken(
                refreshToken,
            ) as {
                tenantId: string;
            };

        const tenant =
            await prisma.tenant.findUnique({
                where: {
                    id: decoded.tenantId,
                },
            });

        if (!tenant) {
            return errorResponse(
                res,
                404,
                'Tenant not found',
            );
        }

        const authToken =
            generateAuthToken({
                tenantId: tenant.id,
                email: tenant.email,
                role: tenant.role,
            });

        return successResponse(
            res,
            200,
            'Auth token refreshed successfully',
            {
                authToken,
            },
        );
    } catch (error) {
        console.error(
            'Error refreshing token:',
            error,
        );

        return errorResponse(
            res,
            401,
            'Invalid refresh token',
            error,
        );
    }
};