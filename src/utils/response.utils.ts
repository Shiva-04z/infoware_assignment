// src/utils/response.util.ts

import { Response } from 'express';

export const successResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data?: unknown,
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (
    res: Response,
    statusCode: number,
    message: string,
    error?: unknown,
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};