// Database validation schemas
// This file will be populated in task 5.1

import { z } from 'zod';

export const gameSchema = z.object({
    id: z.number(),
    homeTeamId: z.number(),
    awayTeamId: z.number(),
});
