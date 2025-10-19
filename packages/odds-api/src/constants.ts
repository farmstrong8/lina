export const ODDS_API = {
    BASE_URL: 'https://api.the-odds-api.com/v4',
    ENDPOINTS: {
        SPORTS: '/sports',
        EVENTS: '/sports/{sport}/events',
        ODDS: '/sports/{sport}/odds',
    },
    PARAMS: {
        REGIONS: ['us'] as const,
        MARKETS: ['h2h', 'spreads', 'totals'] as const,
        ODDS_FORMAT: 'american' as const,
        BOOKMAKER: 'fanduel' as const,
    },
    RATE_LIMITS: {
        REQUESTS_PER_MINUTE: 500,
        RETRY_ATTEMPTS: 3,
        BACKOFF_MULTIPLIER: 1.5,
        INITIAL_DELAY: 500,
    },
} as const;
