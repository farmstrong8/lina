export const FOOTBALL_API = {
    BASE_URL: 'https://v1.american-football.api-sports.io',
    ENDPOINTS: {
        GAMES: '/games',
        TEAMS: '/teams',
        PLAYERS: '/players',
        INJURIES: '/injuries',
        STATISTICS: '/players/statistics',
    },
    HEADERS: {
        HOST: 'v1.american-football.api-sports.io',
        KEY_HEADER: 'X-RapidAPI-Key',
    },
    RATE_LIMITS: {
        REQUESTS_PER_MINUTE: 100,
        RETRY_ATTEMPTS: 3,
        BACKOFF_MULTIPLIER: 2,
        INITIAL_DELAY: 1000,
    },
} as const;
