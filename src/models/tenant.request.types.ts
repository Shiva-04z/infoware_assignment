import {Request} from 'express';


interface CreateTenantBody {
    name: string;
    email: string;
    password: string;
}


interface Tenant {
    id: string;
    name: string;
    email: string;
    apiKey: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

interface FetchTenantParams{
    tenantId: string;
}

interface CreateTenantBody {
    name: string;
    email: string;
}

interface RefreshTokenBody {
    refreshToken: string;
}

interface LoginTenantBody {
    email: string;
    password: string;
}


export interface LoginTenantRequest extends Request<any, any, LoginTenantBody> {
}

export interface FetchTenantRequest extends Request<FetchTenantParams, any, any> {
}

export interface CreateTenantRequest extends Request<any, any, CreateTenantBody> {
}

export interface RefreshTokenRequest extends Request<any, any, RefreshTokenBody> {
}

export interface DeleteDocumentRequest extends Request<DeleteDocumentParams, any, any> {
}