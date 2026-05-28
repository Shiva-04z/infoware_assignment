// src/api/routes/tenant.routes.ts
import { Router } from 'express';
import prisma from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { CreateTenantRequest } from '../../types';

const router = Router();

router.post('/tenant', async (req, res) => {
    try {
        const { name, email }: CreateTenantRequest = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check if tenant already exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { email },
        });

        if (existingTenant) {
            return res.status(409).json({ error: 'Tenant with this email already exists' });
        }

        const apiKey = uuidv4();

        const tenant = await prisma.tenant.create({
            data: {
                name,
                email,
                apiKey,
                status: 'ACTIVE',
            },
        });

        res.status(201).json({
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            apiKey: tenant.apiKey,
            status: tenant.status,
        });
    } catch (error) {
        console.error('Error creating tenant:', error);
        res.status(500).json({ error: 'Failed to create tenant' });
    }
});

router.get('/tenant/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const tenant = await prisma.tenant.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { documents: true, queries: true },
                },
            },
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            status: tenant.status,
            createdAt: tenant.createdAt,
            documentCount: tenant._count.documents,
            queryCount: tenant._count.queries,
        });
    } catch (error) {
        console.error('Error fetching tenant:', error);
        res.status(500).json({ error: 'Failed to fetch tenant' });
    }
});

export default router;