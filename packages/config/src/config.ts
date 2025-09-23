// Configuration implementation
// This file will be populated in task 4

import type { LinaConfig } from './types';

export const config: LinaConfig = {
    apis: {
        sportsApi: {
            baseUrl:
                process.env.SPORTS_API_BASE_URL || 'https://v1.american-football.api-sports.io',
            apiKey: process.env.SPORTS_API_KEY || '',
        },
        oddsApi: {
            baseUrl: process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4',
            apiKey: process.env.ODDS_API_KEY || '',
        },
    },
    database: {
        path: process.env.DATABASE_PATH || './db/lina.db',
    },
    ai: {
        ollama: {
            baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
            model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
        },
    },
};
