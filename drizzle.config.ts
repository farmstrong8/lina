import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log(process.env.DATABASE_PATH)

export default defineConfig({
  out: './packages/database/drizzle',
  schema: './packages/database/src/schemas/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH!,
  },
});