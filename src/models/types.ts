import { Request } from 'express';

export interface Tenant {
    id: string;
    name: string;
    email: string;
    apiKey: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Document {
    id: string;
    tenantId: string;
    filename: string;
    fileSize: number;
    mimeType: string;
    status:
        | 'PROCESSING'
        | 'COMPLETED'
        | 'FAILED'
        | 'DELETED';

    chunkCount: number;

    metadata?: Record<string, any>;
}

export interface CreateTenantBody {
    name: string;
    email: string;
}

export interface TenantIdParams {
    id: string;
}

export interface RefreshTokenBody {
    refreshToken: string;
}

export interface QueryRequestBody {
    query: string;
    topK?: number;
    minConfidence?: number;
}

export interface QueryResponse {
    answer: string;
    sources: SourceDocument[];
    confidence: number;
    guardrailTriggered: boolean;
}

export interface SourceDocument {
    id: string;
    content: string;
    filename: string;
    score: number;
    metadata?: Record<string, any>;
}

export interface TenantParams {
    tenantId: string;
}

export interface DocumentParams {
    tenantId: string;
    documentId: string;
}

export interface UploadDocumentBody {
    metadata?: string;
}

export interface FetchDocumentsQuery {
    page?: string;
    limit?: string;
}

export interface UploadDocumentRequest
    extends Request<
        TenantParams,
        any,
        UploadDocumentBody
    > {
    file?: Express.Multer.File;
}