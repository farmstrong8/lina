import { z } from 'zod';

const configSchema = z.object({
    ODDS_API_KEY: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
