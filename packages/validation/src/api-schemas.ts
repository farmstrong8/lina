// API validation schemas
// This file will be populated in task 6.1

import { z } from 'zod';

export const apiResponseSchema = z.object({
    data: z.unknown(),
    success: z.boolean(),
    message: z.string().optional(),
});
