import 'dotenv/config';
import { createDatabaseConnection } from '@lina/database';
import { OddsApiClient } from '@lina/odds-api';

/**
 * Odds Aggregator Task
 * Fetches FanDuel odds from OddsApi and stores in database
 */
async function aggregateOdds() {
    console.log('Starting odds aggregation...');

    try {
        // Initialize API client
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) {
            throw new Error('ODDS_API_KEY environment variable is required');
        }

        const oddsClient = OddsApiClient.getInstance(apiKey);
        const _db = createDatabaseConnection();

        // This will be implemented once API types are provided
        console.log('Odds aggregation task ready - waiting for API type definitions');
        console.log('Client stats:', oddsClient.getStats());

        // TODO: Implement actual aggregation logic:
        // 1. Fetch FanDuel odds for upcoming NFL games
        // 2. Transform API response to our database schema
        // 3. Store in bettingLines table
        // 4. Handle duplicates and updates
    } catch (error) {
        console.error('Error during odds aggregation:', error);
        process.exit(1);
    }
}

// Run the aggregation if this script is executed directly
if (require.main === module) {
    aggregateOdds();
}
