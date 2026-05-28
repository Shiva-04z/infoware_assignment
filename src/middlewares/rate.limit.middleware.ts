
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { errorResponse } from "../utils/response.utils";

export const identityRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,

    keyGenerator: (req: any) => {
        if (req.tenant?.id) {
            return `tenant:${req.tenant.id}`;
        }

        if (req.user?.id) {
            return `user:${req.user.id}`;
        }

        return ipKeyGenerator(req.ip);
    },

    handler: (req, res) => {
        return errorResponse(
            res,
            429,
            "Too many requests. Please try again later."
        );
    },
});


export const ipRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,

    keyGenerator: (req) => {
        return ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? "unknown");
    },

    handler: (req, res) => {
        return errorResponse(
            res,
            429,
            "Too many requests. Please try again later."
        );
    },
});