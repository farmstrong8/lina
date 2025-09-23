// API type definitions
// This file will be populated in task 3

export interface ApiResponse<T = unknown> {
    data: T;
    success: boolean;
    message?: string;
}
