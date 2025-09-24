import { FOOTBALL_API, HTTP_STATUS } from '@lina/types';
import type {
    GamesParams,
    GamesResponse,
    InjuriesParams,
    InjuriesResponse,
    PlayersParams,
    PlayersResponse,
    StatisticsParams,
    StatisticsResponse,
} from './types';

/**
 * Singleton client for API-American-Football
 * Focused on NFL team stats, player data, and injury reports
 */
export class FootballApiClient {
    private static instance: FootballApiClient;
    private apiKey: string;
    private baseUrl: string;
    private requestCount = 0;
    private lastRequestTime = 0;

    private constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = FOOTBALL_API.BASE_URL;
    }

    public static getInstance(apiKey?: string): FootballApiClient {
        if (!FootballApiClient.instance) {
            if (!apiKey) {
                throw new Error('API key required for first initialization');
            }
            FootballApiClient.instance = new FootballApiClient(apiKey);
        }
        return FootballApiClient.instance;
    }

    /**
     * Rate limiting: ensure we don't exceed API limits
     */
    private async enforceRateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const minInterval = 60000 / FOOTBALL_API.RATE_LIMITS.REQUESTS_PER_MINUTE;

        if (timeSinceLastRequest < minInterval) {
            const waitTime = minInterval - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        this.lastRequestTime = Date.now();
        this.requestCount++;
    }

    /**
     * Make authenticated request to the API
     */
    private async makeRequest<T>(
        endpoint: string,
        params: Record<string, string> = {}
    ): Promise<T> {
        await this.enforceRateLimit();

        const url = new URL(endpoint, this.baseUrl);
        for (const [key, value] of Object.entries(params)) {
            if (value) url.searchParams.append(key, value);
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': FOOTBALL_API.HEADERS.HOST,
            },
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return response.json() as T;
    }

    /**
     * Get games for a specific league/season/week
     */
    public async getGames(params: GamesParams = {}): Promise<GamesResponse> {
        const queryParams: Record<string, string> = {};

        if (params.league) queryParams.league = params.league;
        if (params.season) queryParams.season = params.season;
        if (params.date) queryParams.date = params.date;
        if (params.week) queryParams.week = params.week;
        if (params.team) queryParams.team = params.team;
        if (params.timezone) queryParams.timezone = params.timezone;

        return this.makeRequest<GamesResponse>('/games', queryParams);
    }

    /**
     * Get players for a specific team/season
     */
    public async getPlayers(params: PlayersParams = {}): Promise<PlayersResponse> {
        const queryParams: Record<string, string> = {};

        if (params.team) queryParams.team = params.team;
        if (params.season) queryParams.season = params.season;
        if (params.search) queryParams.search = params.search;
        if (params.page) queryParams.page = params.page;

        return this.makeRequest<PlayersResponse>('/players', queryParams);
    }

    /**
     * Get player statistics
     */
    public async getPlayerStatistics(params: StatisticsParams = {}): Promise<StatisticsResponse> {
        const queryParams: Record<string, string> = {};

        if (params.league) queryParams.league = params.league;
        if (params.season) queryParams.season = params.season;
        if (params.team) queryParams.team = params.team;
        if (params.player) queryParams.player = params.player;
        if (params.game) queryParams.game = params.game;

        return this.makeRequest<StatisticsResponse>('/players/statistics', queryParams);
    }

    /**
     * Get player injury reports
     */
    public async getInjuries(params: InjuriesParams = {}): Promise<InjuriesResponse> {
        const queryParams: Record<string, string> = {};

        if (params.league) queryParams.league = params.league;
        if (params.season) queryParams.season = params.season;
        if (params.team) queryParams.team = params.team;
        if (params.player) queryParams.player = params.player;
        if (params.date) queryParams.date = params.date;
        if (params.timezone) queryParams.timezone = params.timezone;

        return this.makeRequest<InjuriesResponse>('/injuries', queryParams);
    }

    /**
     * Get request statistics for monitoring
     */
    public getStats() {
        return {
            requestCount: this.requestCount,
            lastRequestTime: this.lastRequestTime,
        };
    }
}
