// Database package exports
export * from './schemas';
export * from './repositories';
export * from './connection';

// Re-export commonly used drizzle-orm functions
export { eq, and, or, not, desc, asc, gte, lte, between } from 'drizzle-orm';

// Database connection type
export type DatabaseConnection = ReturnType<typeof import('./connection').createDatabaseConnection>;
