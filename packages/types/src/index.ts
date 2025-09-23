/**
 * LINA Types Package
 * Centralized TypeScript type definitions for the entire LINA application
 */

// Re-export all API types
export * from './api';

// Re-export all database types
export * from './database';

// Re-export all analysis types
export * from './analysis';

// Re-export all constants
export * from './constants';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string | number;

// Generic response wrapper
export interface Response<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: string[];
}

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Filter types
export interface DateRange {
    start: Date;
    end: Date;
}

export interface GameFilters {
    leagueIds?: number[];
    teamIds?: number[];
    dateRange?: DateRange;
    status?: string[];
}

export interface AnalysisFilters {
    gameIds?: number[];
    confidenceMin?: number;
    confidenceMax?: number;
    expectedValueMin?: number;
    expectedValueMax?: number;
    types?: ('straight_bet' | 'parlay')[];
    betTypes?: ('spread' | 'moneyline' | 'total')[];
}

// Environment types
export type Environment = 'development' | 'production' | 'test';

// Log levels
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Status types
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export type AggregationStatus =
    | 'idle'
    | 'fetching'
    | 'processing'
    | 'storing'
    | 'completed'
    | 'error';

export type AnalysisStatus = 'queued' | 'analyzing' | 'generating' | 'completed' | 'failed';
