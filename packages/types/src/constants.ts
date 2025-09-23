/**
 * Application Constants
 * Consolidated constants for the LINA application
 */

// Application Config
export const APP_CONFIG = {
    NAME: 'LINA',
    FULL_NAME: 'Line Analysis Assistant',
    VERSION: '1.0.0',
} as const;

// Database Config
export const DATABASE_CONFIG = {
    DEFAULT_PATH: './db/lina.db',
    BACKUP_PATH: './db/backups',
    WAL_MODE: true,
} as const;

// API Configuration
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

// Sports Data
export const LEAGUES = {
    NFL: {
        ID: 1,
        NAME: 'NFL',
        ODDS_KEY: 'americanfootball_nfl',
    },
} as const;

export const GAME_STATUS = {
    NOT_STARTED: 'NS',
    IN_PROGRESS: 'IP',
    FINAL: 'FT',
    POSTPONED: 'PPD',
    CANCELLED: 'CANC',
} as const;

export const INJURY_STATUS = {
    OUT: 'OUT',
    DOUBTFUL: 'DOUBTFUL',
    QUESTIONABLE: 'QUESTIONABLE',
    PROBABLE: 'PROBABLE',
} as const;

export const BETTING_MARKETS = {
    MONEYLINE: 'h2h',
    SPREAD: 'spreads',
    TOTAL: 'totals',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Timeouts (milliseconds)
export const TIMEOUTS = {
    DEFAULT: 30000,
    ODDS_API: 10000,
    FOOTBALL_API: 15000,
} as const;
