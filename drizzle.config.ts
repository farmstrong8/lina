import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './packages/database/drizzle',
    schema: './packages/database/src/schemas/index.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: './packages/database/src/lina.db',
    },
});
