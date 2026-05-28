// src/api/routes/query.routes.ts
import { Router } from 'express';
import queryService from '../services/query.service';
import { tenantAuthMiddleware } from '../middlewares/auth.middleware';
import { queryRateLimiter } from '../middlewares/rate.limit.middleware';
import { QueryRequest } from '../../types';

const router = Router();

router.use('/:tenantId', tenantAuthMiddleware);
router.use('/:tenantId/query', queryRateLimiter);

router.post('/:tenantId/query', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { query, topK, minConfidence }: QueryRequest = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({ error: 'Query is required' });
        }

        if (query.length > 500) {
            return res.status(400).json({ error: 'Query too long. Maximum 500 characters.' });
        }

        const response = await queryService.query(tenantId, {
            query: query.trim(),
            topK: Math.min(topK || 5, 10), // Limit to max 10 chunks
            minConfidence: minConfidence || 0.7,
        });

        res.json(response);
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: 'Failed to process query' });
    }
});

export default router;