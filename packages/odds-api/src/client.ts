import { ODDS_API } from "@lina/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type {
    EventsParams,
    EventsResponse,
    EventOddsParams,
    EventOddsResponse,
    SportsParams,
    SportsResponse,
} from "./types";

// Configure dayjs to use UTC
dayjs.extend(utc);

/**
 * Singleton client for The Odds API
 * Sport-agnostic client with convenience methods for common use cases
 */
export class OddsApiClient {
    private apiKey: string;
    private baseUrl: string;
    private requestCount = 0;
    private lastRequestTime = 0;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = ODDS_API.BASE_URL;
    }

    /**
     * Rate limiting: ensure we don't exceed API limits
     */
    private async enforceRateLimit(): Promise<void> {
        const now = dayjs.utc().valueOf();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const minInterval = 60000 / ODDS_API.RATE_LIMITS.REQUESTS_PER_MINUTE;

        if (timeSinceLastRequest < minInterval) {
            const waitTime = minInterval - timeSinceLastRequest;
            await new Promise((resolve) => setTimeout(resolve, waitTime));
        }

        this.lastRequestTime = dayjs.utc().valueOf();
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
        // Add API key to params
        const allParams = { ...params, apiKey: this.apiKey };

        for (const [key, value] of Object.entries(allParams)) {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            console.log(url.toString());
            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        return response.json() as T;
    }

    /**
     * Get available sports (does not count against quota)
     */
    public async getSports(
        params: Omit<SportsParams, "apiKey"> = {}
    ): Promise<SportsResponse> {
        const queryParams: Record<string, string> = {};

        if (params.all !== undefined) {
            queryParams.all = params.all.toString();
        }

        return this.makeRequest<SportsResponse>("/v4/sports", queryParams);
    }

    /**
     * Get events for a specific sport (does not count against quota)
     */
    public async getEvents(
        params: Omit<EventsParams, "apiKey">
    ): Promise<EventsResponse> {
        const { sport, ...restParams } = params;
        const queryParams: Record<string, string> = {};

        if (restParams.dateFormat) {
            queryParams.dateFormat = restParams.dateFormat;
        }
        if (restParams.eventIds) {
            queryParams.eventIds = restParams.eventIds;
        }
        if (restParams.commenceTimeFrom) {
            queryParams.commenceTimeFrom = restParams.commenceTimeFrom;
        }
        if (restParams.commenceTimeTo) {
            queryParams.commenceTimeTo = restParams.commenceTimeTo;
        }

        return this.makeRequest<EventsResponse>(
            `/v4/sports/${sport}/events`,
            queryParams
        );
    }

    /**
     * Get odds for a specific sport (counts against quota)
     */
    public async getEventOdds(
        params: Omit<EventOddsParams, "apiKey">
    ): Promise<EventOddsResponse> {
        const sport = params.sport;
        const eventId = params.eventId;
        const queryParams: Record<string, string> = {};

        if (params.regions) {
            queryParams.regions = params.regions;
        }
        if (params.markets) {
            queryParams.markets = params.markets;
        }

        return this.makeRequest<EventOddsResponse>(
            `/v4/sports/${sport}/events/${eventId}/odds`,
            queryParams
        );
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
