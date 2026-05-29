import  {Request} from  'express'
import {TenantParams} from './tenant.request.types';

interface DeleteDocumentParams {
    tenantId: string;
    documentId: string;
}

interface UploadDocumentBody {
    metadata?: string;
}

interface UploadDocumentParams {
    tenantId: string;
}

interface FetchDocumentsQuery {
    page?: string;
    limit?: string;
}

export interface UploadDocumentRequest
    extends Request<
        UploadDocumentParams,
        any,
        UploadDocumentBody
    > {
    file?: Express.Multer.File;
}

export interface FetchDocumentRequest extends  Request<TenantParams,FetchDocumentsQuery,any>{}


export interface DeleteDocumentRequest extends Request<DeleteDocumentParams,any,any> {}