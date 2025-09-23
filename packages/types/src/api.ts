/**
 * API Response Types for Sports API and Odds API
 * These types match the actual API response structure from external services
 */

// Sports API Response Types
export interface ApiGameResponse {
    game: {
        id: number;
        stage: string;
        week: string;
        date: {
            timezone: string;
            date: string;
            time: string;
            timestamp: number;
        };
        venue: {
            name: string;
            city: string;
        };
        status: {
            short: string;
            long: string;
            timer: string | null;
        };
    };
    league: {
        id: number;
        name: string;
        season: string;
        logo: string;
        country: {
            name: string;
            code: string;
            flag: string;
        };
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
        };
        away: {
            id: number;
            name: string;
            logo: string;
        };
    };
    scores: {
        home: {
            quarter_1: number | null;
            quarter_2: number | null;
            quarter_3: number | null;
            quarter_4: number | null;
            overtime: number | null;
            total: number | null;
        };
        away: {
            quarter_1: number | null;
            quarter_2: number | null;
            quarter_3: number | null;
            quarter_4: number | null;
            overtime: number | null;
            total: number | null;
        };
    };
}

export interface ApiPlayerResponse {
    id: number;
    name: string;
    age: number | null;
    height: string;
    weight: string;
    college: string | null;
    group: string;
    position: string;
    number: number;
    salary: string | null;
    experience: number | null;
    image: string;
}

export interface ApiInjuryResponse {
    player: {
        id: number;
        name: string;
        image: string;
    };
    team: {
        id: number;
        name: string;
        logo: string;
    };
    date: string;
    status: string;
    description: string;
}

export interface ApiPlayerStatisticsResponse {
    player: {
        id: number;
        name: string;
        image: string;
    };
    teams: Array<{
        team: {
            id: number;
            name: string;
            logo: string;
        };
        groups: Array<{
            name: string;
            statistics: Array<{
                name: string;
                value: string;
            }>;
        }>;
    }>;
}

// Odds API Response Types
export interface ApiOddsSportResponse {
    key: string;
    group: string;
    title: string;
    description: string;
    active: boolean;
    has_outrights: boolean;
}

export interface ApiOddsEventResponse {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
}

export interface ApiOddsResponse {
    id: string;
    sport_key: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Array<{
        key: string;
        title: string;
        last_update: string;
        markets: Array<{
            key: string; // "h2h", "spreads", "totals"
            outcomes: Array<{
                name: string;
                price: number;
                point?: number;
            }>;
        }>;
    }>;
}

// Generic API Response Wrapper
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
    errors?: string[];
}

// API Error Types
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiRateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
    retryAfter?: number;
}
