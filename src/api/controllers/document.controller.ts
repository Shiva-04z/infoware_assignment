import { Request, Response } from 'express';

import documentService from '../../services/document.service';

import {DeleteDocumentRequest,UploadDocumentRequest,FetchDocumentRequest} from '../../models/document.request.types';

import {
    successResponse,
    errorResponse,
} from '../../utils/response.utils';


export const uploadDocument = async (
    req: UploadDocumentRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const  tenantId  = req.params.tenantId;

        const file = req.file;

        const metadata = req.body.metadata
            ? JSON.parse(req.body.metadata)
            : {};

        const document =
            await documentService.processDocument(
                tenantId,
                file!,
                metadata,
            );

        return successResponse(
            res,
            202,
            'Document uploaded and processing started',
            {
                id: document.id,
                filename: document.filename,
                status: document.status,
            },
        );
    } catch (error) {
        console.error(
            'Error uploading document:',
            error,
        );
        // if (error?.message.toString().includes('Empty')) {
        //     return errorResponse(
        //         res,
        //         400,
        //         "The document is empty",
        //         error,
        //     )
        // }

        return errorResponse(
            res,
            500,
            'Failed to upload document',
            error,
        );
    }
};

export const fetchDocuments = async (
    req: FetchDocumentRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const tenantId  = req.params.tenantId!;

        const page =
            parseInt(req.query.page as string) || 1;

        const limit =
            parseInt(req.query.limit as string) || 10;

        const result =
            await documentService.getDocuments(
                tenantId,
                page,
                limit,
            );

        return successResponse(
            res,
            200,
            'Documents fetched successfully',
            result,
        );
    } catch (error) {
        console.error(
            'Error fetching documents:',
            error,
        );

        return errorResponse(
            res,
            500,
            'Failed to fetch documents',
            error,
        );
    }
};


export const deleteDocument = async (
    req: DeleteDocumentRequest,
    res: Response,
): Promise<Response | void> => {
    try {
        const { tenantId, documentId } =
            req.params;

        await documentService.deleteDocument(
            tenantId,
            documentId,
        );

        return successResponse(
            res,
            200,
            'Document deleted successfully',
        );
    } catch (error) {
        console.error(
            'Error deleting document:',
            error,
        );

        return errorResponse(
            res,
            500,
            'Failed to delete document',
            error,
        );
    }
};