import type { DatabaseClient } from '@lina/database';
import { events, type Event, type NewEvent, odds } from '@lina/database';
import { Logger } from '@lina/logger';
import type { Market, OddsApiClient } from '@lina/odds-api';
import type { Event as ApiEvent, EventOdds as ApiEventOdds } from '@lina/odds-api';
import dayjs from 'dayjs';
import { and, gte, lte } from 'drizzle-orm';
import { FANDUEL_BOOKMAKER_KEY, NFL_MARKETS, NFL_SPORT_KEY } from './constants';

export class OddsAggregator {
    private db: ReturnType<DatabaseClient['getDb']>;

    constructor(
        private logger: Logger,
        private dbClient: DatabaseClient,
        private oddsApiClient: OddsApiClient
    ) {
        this.db = dbClient.getDb();
    }

    /**
     * Main aggregation workflow
     */
    async aggregate() {
        this.logger.info('Starting football odds aggregation...');

        try {
            const weekRange = this.getWeekRange();
            const events = await this.getOrFetchEvents(weekRange);

            await this.processEventsOdds(events);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * Get start and end timestamps for current week
     */
    private getWeekRange(): { startOfWeek: number; endOfWeek: number } {
        const startOfWeek = dayjs.utc().startOf('week');
        const endOfWeek = dayjs.utc().endOf('week');

        this.logger.info(
            `Week range: ${startOfWeek.format('YYYY-MM-DD')} to ${endOfWeek.format('YYYY-MM-DD')}`
        );

        return { startOfWeek: startOfWeek.unix(), endOfWeek: endOfWeek.unix() };
    }

    /**
     * Get events from DB or fetch from API if not found
     */
    private async getOrFetchEvents(weekRange: {
        startOfWeek: number;
        endOfWeek: number;
    }) {
        let existingEvents = await this.queryEventsFromDb(weekRange);

        if (existingEvents.length === 0) {
            this.logger.info('No events in DB, fetching from API...');
            existingEvents = await this.fetchAndStoreEvents();
        } else {
            this.logger.info(`Found ${existingEvents.length} events in database`);
        }

        return existingEvents;
    }

    /**
     * Query events from database for given time range
     */
    private async queryEventsFromDb(weekRange: {
        startOfWeek: number;
        endOfWeek: number;
    }) {
        return this.db
            .select()
            .from(events)
            .where(
                and(
                    gte(events.startTime, weekRange.startOfWeek),
                    lte(events.startTime, weekRange.endOfWeek)
                )
            );
    }

    /**
     * Fetch events from API and store in database
     */
    private async fetchAndStoreEvents() {
        const apiEvents = await this.oddsApiClient.getEvents({
            sport: NFL_SPORT_KEY,
        });

        this.logger.info(`Fetched ${apiEvents.length} events from API`);

        const insertedEvents: Event[] = [];
        const now = dayjs.utc().unix();
        for (const apiEvent of apiEvents) {
            const [inserted] = await this.db
                .insert(events)
                .values({
                    homeTeam: apiEvent.home_team,
                    awayTeam: apiEvent.away_team,
                    eventId: apiEvent.id,
                    startTime: dayjs.utc(apiEvent.commence_time).unix(),
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: events.eventId,
                    set: {
                        homeTeam: apiEvent.home_team,
                        awayTeam: apiEvent.away_team,
                        startTime: dayjs.utc(apiEvent.commence_time).unix(),
                        updatedAt: now,
                    },
                })
                .returning();

            insertedEvents.push(inserted);
        }

        this.logger.info(`Upserted ${insertedEvents.length} events in database`);
        return insertedEvents;
    }

    /**
     * Process and store odds for all events
     */
    private async processEventsOdds(dbEvents: Event[]) {
        for (const event of dbEvents) {
            try {
                await this.processEventOdds(event);
            } catch (error) {
                this.logger.error({
                    message: `Failed to process event ${event.id}`,
                    error,
                });
            }
        }
    }

    /**
     * Process and store odds for a single event
     */
    private async processEventOdds(event: Event) {
        this.logger.info(`Processing odds for ${event.homeTeam} vs ${event.awayTeam}`);

        const oddsData = await this.fetchEventOdds(event);

        // For now we are only getting fanduel
        const bookmaker = oddsData.bookmakers[0];
        const markets = bookmaker.markets;

        for (const market of markets) {
            await this.storeMarketOdds(event.id, market);
        }
        this.logger.info(`Successfully stored odds for event ${event.id}`);
    }

    /**
     * Fetch odds for a specific event from API
     */
    private async fetchEventOdds(event: Event): Promise<ApiEventOdds> {
        // Note: You'll need to store API event ID in your events table
        // For now using DB ID as placeholder
        return this.oddsApiClient.getEventOdds({
            sport: NFL_SPORT_KEY,
            eventId: event.eventId.toString(),
            markets: NFL_MARKETS.join(','),
            bookmakers: FANDUEL_BOOKMAKER_KEY,
            regions: 'us',
        });
    }

    /**
     * Store a single market with its outcomes
     */
    private async storeMarketOdds(eventId: number, market: Market) {
        const now = dayjs.utc().unix();

        // Upsert all odds for this market
        for (const outcome of market.outcomes) {
            await this.db
                .insert(odds)
                .values({
                    eventId,
                    market: market.key,
                    name: outcome.name,
                    price: outcome.price,
                    point: outcome.point ?? null,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: [odds.eventId, odds.market, odds.name, odds.point],
                    set: {
                        price: outcome.price,
                        point: outcome.point ?? null,
                        updatedAt: now,
                    },
                });
        }

        this.logger.info(`Stored ${market.outcomes.length} odds for ${market.key}`);
    }
}
