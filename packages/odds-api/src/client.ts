import { HTTP_STATUS, ODDS_API } from '@lina/types';

/**
 * Singleton client for The Odds API
 * Focused on FanDuel odds for NFL games
 */
export class OddsApiClient {
    private static instance: OddsApiClient;
    private apiKey: string;
    private baseUrl: string;
    private requestCount = 0;
    private lastRequestTime = 0;

    private constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = ODDS_API.BASE_URL;
    }

    public static getInstance(apiKey?: string): OddsApiClient {
        if (!OddsApiClient.instance) {
            if (!apiKey) {
                throw new Error('API key required for first initialization');
            }
            OddsApiClient.instance = new OddsApiClient(apiKey);
        }
        return OddsApiClient.instance;
    }

    /**
     * Rate limiting: ensure we don't exceed API limits
     */
    private async enforceRateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const minInterval = 60000 / ODDS_API.RATE_LIMITS.REQUESTS_PER_MINUTE;

        if (timeSinceLastRequest < minInterval) {
            const waitTime = minInterval - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        this.lastRequestTime = Date.now();
        this.requestCount++;
    }

    /**
     * Get FanDuel odds for NFL games
     * This method will be implemented once we have the API response types
     */
    public async getFanDuelOdds(params: any): Promise<any> {
        // Implementation will be added when API types are provided
        throw new Error('Method not implemented yet - waiting for API types');
    }

    /**
     * Get upcoming NFL games with odds
     * This method will be implemented once we have the API response types
     */
    public async getUpcomingGames(): Promise<any> {
        // Implementation will be added when API types are provided
        throw new Error('Method not implemented yet - waiting for API types');
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
