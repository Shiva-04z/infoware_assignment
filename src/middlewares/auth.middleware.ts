// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const tenantAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tenantId = req.params.tenantId;
    const apiKey = req.headers['x-api-key'] as string;

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
    }

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    try {
        const tenant = await prisma.tenant.findFirst({
            where: {
                id: tenantId,
                apiKey: apiKey,
                status: 'ACTIVE',
            },
        });

        if (!tenant) {
            return res.status(403).json({ error: 'Invalid tenant or API key' });
        }

        // Attach tenant to request for later use
        (req as any).tenant = tenant;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};