import 'dotenv/config';
import { createDatabaseConnection } from '@lina/database';
import { FootballApiClient } from '@lina/football-api';

/**
 * Football Aggregator Task
 * Fetches NFL team stats, schedules, and injury data from American Football API
 */
async function aggregateFootballData() {
    console.log('Starting football data aggregation...');

    try {
        // Initialize API client
        const apiKey = process.env.FOOTBALL_API_KEY;
        if (!apiKey) {
            throw new Error('FOOTBALL_API_KEY environment variable is required');
        }

        const footballClient = FootballApiClient.getInstance(apiKey);
        const _db = createDatabaseConnection();

        // This will be implemented once API types are provided
        console.log('Football aggregation task ready - waiting for API type definitions');
        console.log('Client stats:', footballClient.getStats());

        // TODO: Implement actual aggregation logic:
        // 1. Fetch team schedules and game data
        // 2. Fetch player injury reports
        // 3. Fetch team statistics
        // 4. Transform API responses to our database schemas
        // 5. Store in games, teams, and playerInjuries tables
        // 6. Handle duplicates and updates
    } catch (error) {
        console.error('Error during football data aggregation:', error);
        process.exit(1);
    }
}

// Run the aggregation if this script is executed directly
if (require.main === module) {
    aggregateFootballData();
}
