import {Request} from 'express';


interface CreateTenantBody {
    name: string;
    email: string;
    password: string;
}


interface RefreshTokenBody {
    refreshToken: string;
}

interface LoginTenantBody {
    email: string;
    password: string;
}

export interface  TenantParams{
    tenantId: string|null;
}


export interface LoginTenantRequest extends Request<any, any, LoginTenantBody> {
}

export interface FetchTenantRequest extends Request<TenantParams, any, any> {
}

export interface CreateTenantRequest extends Request<any, any, CreateTenantBody> {
}

export interface RefreshTokenRequest extends Request<any, any, RefreshTokenBody> {
}

