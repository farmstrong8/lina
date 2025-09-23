// Configuration type definitions
// This file will be populated in task 4

export interface LinaConfig {
    apis: {
        sportsApi: {
            baseUrl: string;
            apiKey: string;
        };
        oddsApi: {
            baseUrl: string;
            apiKey: string;
        };
    };
    database: {
        path: string;
    };
    ai: {
        ollama: {
            baseUrl: string;
            model: string;
        };
    };
}
