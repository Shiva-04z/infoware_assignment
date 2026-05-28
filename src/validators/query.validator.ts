
import { z } from 'zod';

export const processQuerySchema = z.object({
    query: z
        .string({
            required_error:
                'Query is required',
        })
        .trim()
        .min(1, 'Query is required')
        .max(
            500,
            'Query too long. Maximum 500 characters.',
        ),

    topK: z
        .number()
        .min(1)
        .max(10)
        .optional(),

    minConfidence: z
        .number()
        .min(0)
        .max(1)
        .optional(),
});