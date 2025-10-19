/**
 * TypeScript interfaces for The Odds API responses
 * Based on The Odds API v4 specifications
 */

// Sports endpoint types
export interface Sport {
    key: string;
    group: string;
    title: string;
    description: string;
    active: boolean;
    has_outrights: boolean;
}

export interface SportsResponse extends Array<Sport> {}

// Common types
export interface Outcome {
    name: string;
    price: number;
    point?: number;
}

export interface Market {
    key: string; // h2h, spreads, totals, outrights, h2h_lay, outrights_lay
    outcomes: Outcome[];
}

export interface Bookmaker {
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
}

// Events endpoint types
export interface Event {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
}

export interface EventsResponse extends Array<Event> {}

// Odds endpoint types
export interface EventOdds {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
}

export interface EventOddsResponse extends EventOdds {}

// Request parameter types
export interface SportsParams {
    apiKey: string;
    all?: boolean;
}

export interface EventsParams {
    sport: string;
    apiKey: string;
    dateFormat?: 'unix' | 'iso';
    eventIds?: string;
    commenceTimeFrom?: string;
    commenceTimeTo?: string;
}

export interface EventOddsParams {
    sport: string;
    eventId: string;
    apiKey: string;
    regions?: RegionType;
    markets?: string;
    dateFormat?: 'unix' | 'iso';
    oddsFormat?: 'decimal' | 'american';
    bookmakers?: string;
}
// Region types
export type RegionType = 'us' | 'us2' | 'uk' | 'au' | 'eu';
