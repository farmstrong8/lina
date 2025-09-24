import 'dotenv/config';
import {
    type DatabaseConnection,
    type Game,
    type NewGame,
    type NewPlayerInjury,
    type NewTeam,
    and,
    createDatabaseConnection,
    eq,
    games,
    gte,
    lte,
    playerInjuries,
    teams,
} from '@lina/database';
import { FootballApiClient } from '@lina/football-api';

/**
 * Football Aggregator Task
 * ODDS-FIRST APPROACH: Only processes games that already exist in database (created by odds aggregator)
 * Enriches games with detailed player stats, injury reports, and team information
 */
async function aggregateFootballData() {
    console.log('Starting football data aggregation (odds-first approach)...');

    try {
        const { footballClient, db } = await initializeClients();
        const gamesWithOdds = await getGamesWithOdds(db);

        if (gamesWithOdds.length === 0) {
            console.log('No games with odds found. Run football-odds-aggregator first.');
            return;
        }

        console.log(`Found ${gamesWithOdds.length} games with odds to enrich`);

        for (const game of gamesWithOdds) {
            await enrichGameData(footballClient, db, game);
        }

        console.log('Football data aggregation completed successfully');
        console.log('Client stats:', footballClient.getStats());
    } catch (error) {
        console.error('Error during football data aggregation:', error);
        process.exit(1);
    }
}

/**
 * Initialize API client and database connection
 */
async function initializeClients() {
    const apiKey = process.env.FOOTBALL_API_KEY;
    if (!apiKey) {
        throw new Error('FOOTBALL_API_KEY environment variable is required');
    }

    const footballClient = FootballApiClient.getInstance(apiKey);
    const db = createDatabaseConnection();

    return { footballClient, db };
}

/**
 * Get all games that have odds (created by odds-aggregator) but need enrichment
 */
async function getGamesWithOdds(db: DatabaseConnection) {
    console.log('Finding games with odds that need player data...');

    // Get games that exist in our database (created by odds aggregator)
    // Focus on upcoming/recent games that need analysis
    const currentTime = Date.now();
    const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60 * 1000;
    const sevenDaysFromNow = currentTime + 7 * 24 * 60 * 60 * 1000;

    return db
        .select()
        .from(games)
        .where(
            // Games within a week window (past and future)
            and(gte(games.gameDate, sevenDaysAgo), lte(games.gameDate, sevenDaysFromNow))
        );
}

/**
 * Enrich a single game with detailed player and team data
 */
async function enrichGameData(
    footballClient: FootballApiClient,
    db: DatabaseConnection,
    game: Game
) {
    console.log(`Enriching data for ${game.homeTeam} vs ${game.awayTeam}...`);

    try {
        // Find teams in API by matching names
        const homeTeamData = await findTeamByName(footballClient, game.homeTeam);
        const awayTeamData = await findTeamByName(footballClient, game.awayTeam);

        if (!homeTeamData || !awayTeamData) {
            console.warn(`Could not find team data for ${game.homeTeam} vs ${game.awayTeam}`);
            return;
        }

        // Ensure teams exist in our database
        await ensureTeamExists(db, homeTeamData);
        await ensureTeamExists(db, awayTeamData);

        // Get injury reports for both teams
        await fetchAndStoreInjuries(footballClient, db, game, homeTeamData.id);
        await fetchAndStoreInjuries(footballClient, db, game, awayTeamData.id);

        // Update game with additional details if found
        await updateGameDetails(footballClient, db, game, homeTeamData.id, awayTeamData.id);

        console.log(`✓ Enriched ${game.homeTeam} vs ${game.awayTeam}`);
    } catch (error) {
        console.error(`Error enriching game ${game.homeTeam} vs ${game.awayTeam}:`, error);
    }
}

/**
 * Find team in API by name matching
 */
async function findTeamByName(footballClient: FootballApiClient, teamName: string) {
    try {
        // Get current season player statistics which includes team info
        const currentYear = new Date().getFullYear();
        const statisticsResponse = await footballClient.getPlayerStatistics({
            league: '1', // NFL
            season: currentYear.toString(),
        });

        // Extract unique teams from statistics response
        const teams = new Map();
        for (const playerStat of statisticsResponse.response) {
            if (
                playerStat.team &&
                (playerStat.team.name === teamName ||
                    playerStat.team.name.includes(teamName) ||
                    teamName.includes(playerStat.team.name))
            ) {
                teams.set(playerStat.team.id, playerStat.team);
            }
        }

        return Array.from(teams.values())[0] || null;
    } catch (error) {
        console.error(`Error finding team ${teamName}:`, error);
        return null;
    }
}

/**
 * Fetch and store injury reports for a team
 */
async function fetchAndStoreInjuries(
    footballClient: FootballApiClient,
    db: DatabaseConnection,
    game: Game,
    teamId: string
) {
    try {
        const currentYear = new Date().getFullYear();
        const injuriesResponse = await footballClient.getInjuries({
            league: '1', // NFL
            season: currentYear.toString(),
            team: teamId,
        });

        for (const injury of injuriesResponse.response) {
            const injuryData: NewPlayerInjury = {
                playerName: injury.player.name,
                team: injury.team.name,
                position: injury.player.position,
                injuryStatus: mapInjuryStatus(injury.status.type),
                bodyPart: null,
                description: injury.status.detail,
                gameId: game.id,
                reportedAt: new Date(injury.date).getTime(),
                updatedAt: Date.now(),
            };

            // Insert injury report (allow duplicates for historical tracking)
            await db.insert(playerInjuries).values(injuryData);
        }

        console.log(
            `  → Found ${injuriesResponse.response.length} injury reports for team ${teamId}`
        );
    } catch (error) {
        console.error(`Error fetching injuries for team ${teamId}:`, error);
    }
}

/**
 * Update game with additional details from API
 */
async function updateGameDetails(
    footballClient: FootballApiClient,
    db: DatabaseConnection,
    game: Game,
    homeTeamId: string,
    _awayTeamId: string
) {
    try {
        const currentYear = new Date().getFullYear();

        // Try to find the specific game in the API
        const gamesResponse = await footballClient.getGames({
            league: '1', // NFL
            season: currentYear.toString(),
            team: homeTeamId,
        });

        // Find matching game by teams and approximate date
        const matchingGame = gamesResponse.response.find(apiGame => {
            const gameDate = new Date(apiGame.date).getTime();
            const timeDiff = Math.abs(gameDate - game.gameDate);
            const oneDayMs = 24 * 60 * 60 * 1000;

            return (
                timeDiff < oneDayMs &&
                (apiGame.teams.home.name === game.homeTeam ||
                    apiGame.teams.away.name === game.awayTeam)
            );
        });

        if (matchingGame) {
            // Update game with additional details
            const updateData: Partial<NewGame> = {
                week: Number.parseInt(matchingGame.week) || game.week,
                status: mapGameStatus(matchingGame.status.short),
                homeScore: matchingGame.scores.home || game.homeScore,
                awayScore: matchingGame.scores.away || game.awayScore,
                venue: matchingGame.venue.name || game.venue,
                surfaceType: matchingGame.venue.surface || game.surfaceType,
                updatedAt: Date.now(),
            };

            await db.update(games).set(updateData).where(eq(games.id, game.id));

            console.log('  → Updated game details from API');
        }
    } catch (error) {
        console.error('Error updating game details:', error);
    }
}

/**
 * Ensure team exists in database, insert if not found
 */
async function ensureTeamExists(
    db: DatabaseConnection,
    teamData: { id: number; name: string; city: string; code: string }
) {
    const existingTeam = await db
        .select()
        .from(teams)
        .where(eq(teams.name, teamData.name))
        .limit(1);

    if (existingTeam.length === 0) {
        const newTeam: NewTeam = {
            name: teamData.name,
            city: teamData.city,
            abbreviation: teamData.code,
            conference: null, // Could be determined from team name/division
            division: null,
            primaryColor: null,
            secondaryColor: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        await db.insert(teams).values(newTeam);
        console.log(`  → Created team: ${teamData.name}`);
    }
}

/**
 * Map API game status to our internal status codes
 */
function mapGameStatus(apiStatus: string): string {
    switch (apiStatus.toLowerCase()) {
        case 'ns':
            return 'NS'; // Not Started
        case 'live':
        case '1q':
        case '2q':
        case '3q':
        case '4q':
        case 'ht':
        case 'ot':
            return 'IP'; // In Progress
        case 'ft':
            return 'FT'; // Full Time
        case 'ppd':
            return 'PPD'; // Postponed
        case 'canc':
            return 'CANC'; // Cancelled
        default:
            return apiStatus.toUpperCase();
    }
}

/**
 * Map API injury status to our internal status codes
 */
function mapInjuryStatus(apiStatus: string): string {
    switch (apiStatus.toLowerCase()) {
        case 'out':
            return 'OUT';
        case 'doubtful':
            return 'DOUBTFUL';
        case 'questionable':
            return 'QUESTIONABLE';
        case 'probable':
            return 'PROBABLE';
        case 'injured reserve':
            return 'OUT';
        default:
            return 'QUESTIONABLE'; // Default for unknown statuses
    }
}

// Run the aggregation if this script is executed directly
if (require.main === module) {
    aggregateFootballData();
}
