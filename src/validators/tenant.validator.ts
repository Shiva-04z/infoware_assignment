// src/validators/tenant.validator.ts

import { z } from 'zod';

export const createTenantSchema = z.object({
    name: z
        .string({
            required_error:
                'Name is required',
        })
        .trim()
        .min(1, 'Name is required'),

    email: z
        .string({
            required_error:
                'Email is required',
        })
        .email('Invalid email address'),
    password: z.string({
        required_error:
        'Password is required',
    }).min(6, 'Password must be at least 6 characters').max(14, 'Password must at most 14 characters'),
});


export const tenantLoginSchema = z.object({

    email: z
        .string({
            required_error:
                'Email is required',
        })
        .email('Invalid email address'),
    password: z.string({
        required_error:
            'Password is required',
    }).min(6, 'Password must be at least 6 characters').max(14, 'Password must at most 14 characters'),


})

export  const  fetchTenantSchema = z.object({
    tenantId: z.string({required_error:
    'TenantId is required',}).uuid(),
});
export const refreshAuthTokenSchema =
    z.object({
        refreshToken: z
            .string({
                required_error:
                    'Refresh token is required',
            })
            .trim()
            .min(
                1,
                'Refresh token is required',
            ),
    });