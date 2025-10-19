import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schemas";

export type Database = ReturnType<typeof drizzle<typeof schema>>;
