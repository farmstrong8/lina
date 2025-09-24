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
    point?: number; // For spreads
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
export interface OddsEvent {
    id: string;
    sport_key: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
}

export interface OddsResponse extends Array<OddsEvent> {}

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

export interface OddsParams {
    sport: string;
    apiKey: string;
    regions: string;
    markets?: string;
    dateFormat?: 'unix' | 'iso';
    oddsFormat?: 'decimal' | 'american';
    eventIds?: string;
    bookmakers?: string;
    commenceTimeFrom?: string;
    commenceTimeTo?: string;
    includeLinks?: boolean;
    includeSids?: boolean;
    includeBetLimits?: boolean;
}

// Market types for type safety
export type MarketType = 'h2h' | 'spreads' | 'totals' | 'outrights' | 'h2h_lay' | 'outrights_lay';

// Region types
export type RegionType = 'us' | 'us2' | 'uk' | 'au' | 'eu';

// Popular sport keys for NFL focus
export const NFL_SPORT_KEY = 'americanfootball_nfl';
export const UPCOMING_SPORT_KEY = 'upcoming';

// Common bookmaker keys for FanDuel focus
export const FANDUEL_BOOKMAKER_KEY = 'fanduel';

// Default parameter values (sport-agnostic)
export const DEFAULT_ODDS_PARAMS = {
    regions: 'us' as RegionType,
    markets: 'h2h,spreads,totals',
    dateFormat: 'iso' as const,
    oddsFormat: 'american' as const,
};
