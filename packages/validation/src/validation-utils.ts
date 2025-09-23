// Validation utility functions
// This file will be populated in task 6.1

import type { z } from 'zod';

export function validateData<T>(data: unknown, schema: z.ZodSchema<T>): T {
    return schema.parse(data);
}
