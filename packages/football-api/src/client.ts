import { FOOTBALL_API, HTTP_STATUS } from '@lina/types';

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
     * Get team statistics
     * This method will be implemented once we have the API response types
     */
    public async getTeamStats(params: any): Promise<any> {
        // Implementation will be added when API types are provided
        throw new Error('Method not implemented yet - waiting for API types');
    }

    /**
     * Get player injury reports for a team
     * This method will be implemented once we have the API response types
     */
    public async getPlayerInjuries(params: any): Promise<any> {
        // Implementation will be added when API types are provided
        throw new Error('Method not implemented yet - waiting for API types');
    }

    /**
     * Get game schedule for a specific week
     * This method will be implemented once we have the API response types
     */
    public async getGameSchedule(params: any): Promise<any> {
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
