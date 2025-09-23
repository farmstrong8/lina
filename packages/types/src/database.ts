/**
 * Database Entity Types and Configuration Interfaces
 * These types represent the internal database structure and configuration
 */

// Core Database Entity Types
export interface Game {
    id: number;
    leagueId: number;
    homeTeamId: number;
    awayTeamId: number;
    venueId: string;
    stage: string;
    week: string;
    date: string;
    time: string;
    timestamp: number;
    timezone: string;
    statusShort: string;
    statusLong: string;
    timer: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Team {
    id: number;
    name: string;
    logo: string | null;
}

export interface League {
    id: number;
    name: string;
    season: string;
    logo: string | null;
    countryName: string | null;
    countryCode: string | null;
    countryFlag: string | null;
}

export interface Venue {
    id: string;
    name: string;
    city: string;
}

export interface Player {
    id: number;
    name: string;
    age: number | null;
    height: string | null;
    weight: string | null;
    college: string | null;
    group: string | null;
    position: string | null;
    number: number | null;
    salary: string | null;
    experience: number | null;
    image: string | null;
}

export interface PlayerTeam {
    id: string;
    playerId: number;
    teamId: number;
    season: string;
    isActive: boolean;
}

export interface PlayerStatistic {
    id: string;
    playerId: number;
    teamId: number;
    season: string;
    groupName: string;
    statisticName: string;
    value: string;
}

export interface Injury {
    id: string;
    playerId: number;
    teamId: number;
    date: string;
    status: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameScore {
    id: string;
    gameId: number;
    teamId: number;
    isHome: boolean;
    quarter1: number | null;
    quarter2: number | null;
    quarter3: number | null;
    quarter4: number | null;
    overtime: number | null;
    total: number | null;
}

// Odds Database Entity Types
export interface OddsSport {
    key: string;
    group: string;
    title: string;
    description: string | null;
    active: boolean;
    hasOutrights: boolean;
}

export interface OddsEvent {
    id: string;
    sportKey: string;
    sportTitle: string | null;
    commenceTime: string;
    homeTeam: string;
    awayTeam: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameOddsMapping {
    id: string;
    sportsApiGameId: number;
    oddsApiEventId: string;
    confidence: number;
    mappingMethod: string;
    createdAt: Date;
}

export interface Bookmaker {
    key: string;
    title: string;
    active: boolean;
}

export interface OddsMarket {
    id: string;
    eventId: string;
    bookmakerId: string;
    marketKey: string;
    lastUpdate: string | null;
    createdAt: Date;
}

export interface OddsOutcome {
    id: string;
    marketId: string;
    name: string;
    price: number;
    point: number | null;
    createdAt: Date;
}

export interface BettingLine {
    id: string;
    gameId: number;
    sportsbook: string;
    spread: number | null;
    moneylineHome: number | null;
    moneylineAway: number | null;
    totalPoints: number | null;
    totalOver: number | null;
    totalUnder: number | null;
    timestamp: Date;
}

// AI Analysis Database Entity Types
export interface AiAnalysis {
    id: string;
    gameId: number;
    analysisType: string;
    confidence: number;
    expectedValue: number | null;
    reasoning: string;
    recommendations: unknown; // JSON field
    iteration: number;
    createdAt: Date;
}

export interface AiRecommendation {
    id: string;
    analysisId: string;
    gameId: number;
    type: 'straight_bet' | 'parlay';
    betType: 'spread' | 'moneyline' | 'total' | null;
    recommendation: string | null;
    confidence: number;
    expectedValue: number | null;
    reasoning: string | null;
    createdAt: Date;
}

// Configuration Interfaces
export interface DatabaseConfig {
    path: string;
    enableWal: boolean;
    backupPath: string;
    maxConnections: number;
    queryTimeout: number;
}

export interface ApiConfig {
    baseUrl: string;
    apiKey: string;
    timeout: number;
    rateLimit: {
        requestsPerMinute: number;
        retryAttempts: number;
        backoffMultiplier: number;
    };
}

export interface SportsApiConfig extends ApiConfig {
    defaultLeagues: number[];
}

export interface OddsApiConfig extends ApiConfig {
    defaultRegions: string[];
    defaultMarkets: string[];
}

export interface AggregationConfig {
    sports: Array<{
        key: string;
        leagueId: number;
        enabled: boolean;
    }>;
    dateRange: {
        daysBack: number;
        daysForward: number;
    };
    schedule: {
        games: string;
        odds: string;
        injuries: string;
        statistics: string;
    };
}

export interface AiConfig {
    ollama: {
        baseUrl: string;
        model: string;
        timeout: number;
    };
    analysis: {
        confidenceThreshold: number;
        maxIterations: number;
        enableParlay: boolean;
    };
}

export interface LinaConfig {
    apis: {
        sportsApi: SportsApiConfig;
        oddsApi: OddsApiConfig;
    };
    aggregation: AggregationConfig;
    ai: AiConfig;
    database: DatabaseConfig;
}
