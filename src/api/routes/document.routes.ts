
import { Router } from 'express';

import { AuthMiddleware } from '../../middlewares/auth.middleware';

import { validateBody,validateQuery,validateParams } from '../../middlewares/validation.middleware';

import {fileRequiredMiddleware} from '../../middlewares/file.required.middleware'
import {identityRateLimiter} from  '../../middlewares/rate.limit.middleware';
import {
    uploadDocument,
    fetchDocuments,
    deleteDocument,
} from '../controllers/document.controller';

import { uploadFile } from '../../config/multer.config';

import {
    uploadDocumentSchema,
    fetchDocumentsSchema,
    deleteDocumentSchema,
} from '../../validators/document.validator';

const router = Router();

export const TENANT_BASE_ENDPOINT =
    '/:tenantId';

export const UPLOAD_DOCUMENT_ENDPOINT =
    '/:tenantId/documents';

export const FETCH_DOCUMENTS_ENDPOINT =
    '/:tenantId/documents';

export const DELETE_DOCUMENT_ENDPOINT =
    '/:tenantId/documents/:documentId';


router.use(
    TENANT_BASE_ENDPOINT,
    AuthMiddleware as any,
    identityRateLimiter,
);

router.post(
    UPLOAD_DOCUMENT_ENDPOINT,
    uploadFile.single(
        'file',
    ),
    fileRequiredMiddleware,
    validateBody(uploadDocumentSchema),
    uploadDocument as any,
);

router.get(
    FETCH_DOCUMENTS_ENDPOINT,
    validateQuery(fetchDocumentsSchema),
    fetchDocuments as any,
);

router.delete(
    DELETE_DOCUMENT_ENDPOINT,
    validateParams(deleteDocumentSchema),
    deleteDocument as any,
);

export default router;