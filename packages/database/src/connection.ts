import { DATABASE_CONFIG } from '@lina/types';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schemas';

/**
 * Database connection singleton
 */
class DatabaseConnection {
    private static instance: DatabaseConnection;
    private db: ReturnType<typeof drizzle>;
    private sqlite: Database.Database;

    private constructor() {
        this.sqlite = new Database(DATABASE_CONFIG.DEFAULT_PATH);

        // Enable WAL mode for better performance
        if (DATABASE_CONFIG.WAL_MODE) {
            this.sqlite.pragma('journal_mode = WAL');
        }

        this.db = drizzle(this.sqlite, { schema });
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
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

export function createDatabaseConnection() {
    return DatabaseConnection.getInstance().getDb();
}

export function closeDatabaseConnection() {
    DatabaseConnection.getInstance().close();
}
