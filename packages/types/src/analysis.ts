/**
 * AI Analysis and Recommendation Types
 * These types represent the structure of AI analysis results and betting recommendations
 */

// Core Analysis Types
export interface GameData {
    game: GameInfo;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
    venue: VenueInfo;
    historicalStats: HistoricalStats;
    injuries: InjuryInfo[];
    lines: BettingLines;
    weather?: WeatherInfo;
}

export interface GameInfo {
    id: number;
    startTime: Date;
    status: GameStatus;
    league: LeagueInfo;
    stage: string;
    week: string;
}

export interface TeamInfo {
    id: number;
    name: string;
    logo: string;
    record?: TeamRecord;
    recentForm?: GameResult[];
}

export interface VenueInfo {
    name: string;
    city: string;
}

export interface LeagueInfo {
    id: number;
    name: string;
    season: string;
    country: {
        name: string;
        code: string;
    };
}

export interface GameStatus {
    short: string;
    long: string;
    timer?: string;
}

export interface TeamRecord {
    wins: number;
    losses: number;
    ties?: number;
    winPercentage: number;
}

export interface GameResult {
    gameId: number;
    opponent: string;
    result: 'W' | 'L' | 'T';
    score: {
        team: number;
        opponent: number;
    };
    date: Date;
}

export interface HistoricalStats {
    headToHead: HeadToHeadStats;
    homeTeamStats: TeamStats;
    awayTeamStats: TeamStats;
    seasonTrends: SeasonTrends;
}

export interface HeadToHeadStats {
    totalGames: number;
    homeTeamWins: number;
    awayTeamWins: number;
    ties: number;
    averageTotal: number;
    recentMeetings: GameResult[];
}

export interface TeamStats {
    offense: OffensiveStats;
    defense: DefensiveStats;
    specialTeams?: SpecialTeamsStats;
    situational: SituationalStats;
}

export interface OffensiveStats {
    pointsPerGame: number;
    yardsPerGame: number;
    passingYardsPerGame: number;
    rushingYardsPerGame: number;
    turnoversPerGame: number;
    thirdDownConversion: number;
    redZoneEfficiency: number;
}

export interface DefensiveStats {
    pointsAllowedPerGame: number;
    yardsAllowedPerGame: number;
    passingYardsAllowed: number;
    rushingYardsAllowed: number;
    takeawaysPerGame: number;
    thirdDownDefense: number;
    redZoneDefense: number;
}

export interface SpecialTeamsStats {
    fieldGoalPercentage: number;
    puntAverage: number;
    kickReturnAverage: number;
    puntReturnAverage: number;
}

export interface SituationalStats {
    homeRecord: TeamRecord;
    awayRecord: TeamRecord;
    vsSpreadRecord: SpreadRecord;
    totalRecord: TotalRecord;
}

export interface SpreadRecord {
    covers: number;
    pushes: number;
    losses: number;
    coverPercentage: number;
}

export interface TotalRecord {
    overs: number;
    unders: number;
    pushes: number;
    overPercentage: number;
}

export interface SeasonTrends {
    recentForm: {
        last5Games: GameResult[];
        last10Games: GameResult[];
    };
    homeAwayTrends: {
        homePerformance: TeamPerformance;
        awayPerformance: TeamPerformance;
    };
    monthlyTrends: MonthlyTrend[];
}

export interface TeamPerformance {
    record: TeamRecord;
    averageScore: number;
    averageAllowed: number;
    spreadRecord: SpreadRecord;
}

export interface MonthlyTrend {
    month: string;
    games: number;
    record: TeamRecord;
    averageScore: number;
}

export interface InjuryInfo {
    playerId: number;
    playerName: string;
    position: string;
    status: InjuryStatus;
    description: string;
    impact: InjuryImpact;
    expectedReturn?: Date;
}

export type InjuryStatus = 'Out' | 'Doubtful' | 'Questionable' | 'Probable' | 'I.L.' | 'P.U.P.';

export type InjuryImpact = 'High' | 'Medium' | 'Low';

export interface BettingLines {
    spread: SpreadLine;
    moneyline: MoneylineLine;
    total: TotalLine;
    bookmakers: BookmakerLines[];
}

export interface SpreadLine {
    homeSpread: number;
    awaySpread: number;
    homePrice: number;
    awayPrice: number;
}

export interface MoneylineLine {
    homePrice: number;
    awayPrice: number;
}

export interface TotalLine {
    points: number;
    overPrice: number;
    underPrice: number;
}

export interface BookmakerLines {
    bookmaker: string;
    spread?: SpreadLine;
    moneyline?: MoneylineLine;
    total?: TotalLine;
    lastUpdate: Date;
}

export interface WeatherInfo {
    temperature: number;
    conditions: string;
    windSpeed: number;
    windDirection: string;
    humidity: number;
    precipitation: number;
}

// AI Analysis Result Types
export interface AnalysisResult {
    id: string;
    gameId: number;
    confidence: number;
    expectedValue?: number;
    reasoning: string;
    recommendations: Recommendation[];
    iteration: number;
    createdAt: Date;
    metadata: AnalysisMetadata;
}

export interface AnalysisMetadata {
    modelUsed: string;
    processingTime: number;
    dataQuality: DataQualityScore;
    factors: AnalysisFactor[];
}

export interface DataQualityScore {
    overall: number;
    historical: number;
    injuries: number;
    lines: number;
}

export interface AnalysisFactor {
    name: string;
    weight: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
}

export interface Recommendation {
    id: string;
    type: RecommendationType;
    betType: BetType;
    selection: string;
    confidence: number;
    expectedValue?: number;
    reasoning: string;
    risk: RiskLevel;
    stake?: StakeRecommendation;
}

export type RecommendationType = 'straight_bet' | 'parlay';

export type BetType = 'spread' | 'moneyline' | 'total';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface StakeRecommendation {
    units: number;
    percentage: number;
    reasoning: string;
}

// Parlay-specific Types
export interface ParlayRecommendation extends Recommendation {
    type: 'parlay';
    legs: ParlayLeg[];
    combinedOdds: number;
    combinedConfidence: number;
}

export interface ParlayLeg {
    gameId: number;
    betType: BetType;
    selection: string;
    odds: number;
    confidence: number;
}

// Analysis Request Types
export interface AnalysisRequest {
    gameId: number;
    includeParlay: boolean;
    maxIterations: number;
    confidenceThreshold: number;
}

export interface BatchAnalysisRequest {
    gameIds: number[];
    includeParlay: boolean;
    maxIterations: number;
    confidenceThreshold: number;
    parallel: boolean;
}
