// src/middlewares/validation.middleware.ts

import {
    Request,
    Response,
    NextFunction,
} from 'express';

import { ZodSchema } from 'zod';

import {
    errorResponse,
} from '../utils/response.utils';

export const validateBody =
    (schema: ZodSchema) =>
        (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => {
            try {
                schema.parse(req.body);

                next();
            } catch (error: any) {
                return errorResponse(
                    res,
                    400,
                    error,
                    error.errors,
                );
            }
        };

export const validateParams =
    (schema: ZodSchema) =>
        (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => {
            try {
                schema.parse(req.params);

                next();
            } catch (error: any) {
                return errorResponse(
                    res,
                    400,
                    error,
                    error.errors,
                );
            }
        };

export const validateQuery =
    (schema: ZodSchema) =>
        (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => {
            try {
                schema.parse(req.query);

                next();
            } catch (error: any) {
                return errorResponse(
                    res,
                    400,
                    error,
                    error.errors,
                );
            }
        };