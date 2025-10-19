import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schemas";
import path from "node:path";

// In CommonJS, __dirname is available directly
const DEFAULT_DB_PATH = path.join(__dirname, "lina.db");

/**
 * Database connection singleton
 */
export class DatabaseClient {
    private static instance: DatabaseClient | null = null;
    private db: ReturnType<typeof drizzle>;
    private sqlite: Database.Database;

    private constructor(filename: string) {
        this.sqlite = new Database(filename);
        this.db = drizzle(this.sqlite, { schema });
    }

    public static getInstance(filename = DEFAULT_DB_PATH): DatabaseClient {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new DatabaseClient(filename);
        }
        return DatabaseClient.instance;
    }

    public static reset() {
        if (DatabaseClient.instance) {
            DatabaseClient.instance.close();
            DatabaseClient.instance = null;
        }
    }

    public getDb() {
        return this.db;
    }

    public getSqlite() {
        return this.sqlite;
    }

    public close() {
        this.sqlite.close();
    }
}
