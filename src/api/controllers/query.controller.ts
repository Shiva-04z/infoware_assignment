

import { Request, Response } from 'express';

import queryService from '../../rag/query.service.rag';

import { QueryRequest,QueryResponse } from '../../models/query.request.types';

import {
    successResponse,
    errorResponse,
} from '../../utils/response.utils';

export const processQuery = async (
    req: QueryRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const { tenantId } = req.params;

        const {
            query,
            topK,
            minConfidence,
        } = req.body;

        const response =
            await queryService.query(
                tenantId,
                {
                    query: query.trim(),

                    topK: Math.min(
                        topK || 5,
                        10,
                    ),

                    minConfidence:
                        minConfidence ||
                        0.7,
                },
            );

        return successResponse(
            res,
            200,
            'Query processed successfully',
            response,
        );
    } catch (error) {
        console.error(
            'Error processing query:',
            error,
        );

        return errorResponse(
            res,
            500,
            'Failed to process query',
            error,
        );
    }
};