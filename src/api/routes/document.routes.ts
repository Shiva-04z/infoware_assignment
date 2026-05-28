// src/api/routes/document.routes.ts
import { Router } from 'express';
import multer from 'multer';
import documentService from '../services/document.service';
import { tenantAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'text/plain'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and TXT files are allowed.'));
        }
    },
});

router.use('/:tenantId', tenantAuthMiddleware);

router.post('/:tenantId/documents', upload.single('file'), async (req, res) => {
    try {
        const { tenantId } = req.params;
        const file = req.file;
        const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const document = await documentService.processDocument(tenantId, file, metadata);

        res.status(202).json({
            id: document.id,
            filename: document.filename,
            status: document.status,
            message: 'Document uploaded and processing started',
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

router.get('/:tenantId/documents', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await documentService.getDocuments(tenantId, page, limit);

        res.json(result);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

router.delete('/:tenantId/documents/:documentId', async (req, res) => {
    try {
        const { tenantId, documentId } = req.params;

        await documentService.deleteDocument(tenantId, documentId);

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

export default router;