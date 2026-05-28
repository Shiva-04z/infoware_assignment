import {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    errorResponse,
} from '../utils/response.utils';

export const fileRequiredMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.file) {
        return errorResponse(
            res,
            400,
            'File is required',
        );
    }
    next();
}