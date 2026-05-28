
import { z } from 'zod';

export const fetchDocumentsSchema =
    z.object({
        page: z
            .string()
            .optional(),

        limit: z
            .string()
            .optional(),
    });

export const deleteDocumentSchema =
    z.object({
        documentId: z
            .string({
                required_error:
                    'Document ID is required',
            })
            .trim()
            .min(
                1,
                'Document ID is required',
            ),
    });

export const uploadDocumentSchema =
    z.object({
        metadata: z
            .union([
                z.string(),
                z.record(z.any()),
            ])
            .optional(),
    });