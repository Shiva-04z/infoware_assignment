
import jwt from 'jsonwebtoken';

const JWT_AUTH_SECRET =
    process.env.JWT_AUTH_SECRET ||
    'INFOWARE_ASSIGNMET_AUTH';

const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET ||
    'INFOWARE_ASSIGNMENT_REFRESH';

export const generateAuthToken = (
    payload: object,
): string => {
    return jwt.sign(payload, JWT_AUTH_SECRET, {
        expiresIn: '1h',
    });
};

export const generateRefreshToken = (
    payload: object,
): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

export const verifyAuthToken = (
    token: string,
) => {
    return jwt.verify(
        token,
        JWT_AUTH_SECRET,
    );
};

export const verifyRefreshToken = (
    token: string,
) => {
    return jwt.verify(
        token,
        JWT_REFRESH_SECRET,
    );
};