import 'dotenv/config';
import {
    type DatabaseConnection,
    type Game,
    type NewBettingLine,
    bettingLines,
    createDatabaseConnection,
    eq,
    games,
} from '@lina/database';
import {
    type Bookmaker,
    DEFAULT_ODDS_PARAMS,
    FANDUEL_BOOKMAKER_KEY,
    type Market,
    NFL_SPORT_KEY,
    OddsApiClient,
    type OddsEvent,
    type Outcome,
} from '@lina/odds-api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Configure dayjs to use UTC
dayjs.extend(utc);

/**
 * NFL specific markets for comprehensive betting analysis
 */
const NFL_MARKETS = [
    'totals',
    'team_totals',
    'spreads',
    'player_rush_yds_q1',
    'player_rush_yds_alternate',
    'player_rush_yds',
    'player_rush_reception_yds_alternate',
    'player_rush_reception_yds',
    'player_receptions_alternate',
    'player_rush_attempts',
    'player_receptions',
    'player_reception_yds_alternate',
    'player_reception_yds',
    'player_pass_yds_alternate',
    'player_pass_yds',
    'player_pass_tds_alternate',
    'player_pass_tds',
    'player_anytime_td',
    'h2h',
    'alternate_totals',
    'alternate_team_totals',
    'alternate_spreads',
] as const;

/**
 * Football Odds Aggregator Task
 * Fetches FanDuel odds for NFL games and stores in database
 */
async function aggregateFootballOdds() {
    console.log('Starting football odds aggregation...');

    try {
        const { oddsClient, db } = await initializeClients();
        const oddsResponse = await fetchNFLOdds(oddsClient);

        console.log(`Found ${oddsResponse.length} games with odds`);

        for (const gameOdds of oddsResponse) {
            await processGameOdds(db, gameOdds);
        }

        console.log('Football odds aggregation completed successfully');
        console.log('Client stats:', oddsClient.getStats());
    } catch (error) {
        console.error('Error during football odds aggregation:', error);
        process.exit(1);
    }
}

/**
 * Initialize API client and database connection
 */
async function initializeClients() {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
        throw new Error('ODDS_API_KEY environment variable is required');
    }

    const oddsClient = OddsApiClient.getInstance(apiKey);
    const db = createDatabaseConnection();

    return { oddsClient, db };
}

/**
 * Fetch NFL odds from the API
 */
async function fetchNFLOdds(oddsClient: OddsApiClient) {
    console.log('Fetching FanDuel odds for NFL games...');
    return oddsClient.getOdds({
        sport: NFL_SPORT_KEY,
        regions: DEFAULT_ODDS_PARAMS.regions,
        markets: NFL_MARKETS.join(','),
        dateFormat: DEFAULT_ODDS_PARAMS.dateFormat,
        oddsFormat: DEFAULT_ODDS_PARAMS.oddsFormat,
        bookmakers: FANDUEL_BOOKMAKER_KEY,
    });
}

/**
 * Process odds for a single game
 */
async function processGameOdds(db: DatabaseConnection, gameOdds: OddsEvent) {
    const gameInDb = await findOrCreateGame(db, gameOdds);

    if (!gameInDb) {
        console.warn(
            `Could not find or create game for ${gameOdds.home_team} vs ${gameOdds.away_team}`
        );
        return;
    }

    const fanDuelBookmaker = gameOdds.bookmakers.find(b => b.key === 'fanduel');
    if (!fanDuelBookmaker) {
        console.warn(`No FanDuel odds found for ${gameOdds.home_team} vs ${gameOdds.away_team}`);
        return;
    }

    const bettingLineData = await transformToBettingLine(gameInDb, gameOdds, fanDuelBookmaker);
    await saveBettingLine(db, bettingLineData);

    console.log(`Updated odds for ${gameOdds.home_team} vs ${gameOdds.away_team}`);
}

/**
 * Transform API odds data to our betting line schema
 */
async function transformToBettingLine(
    gameInDb: Game,
    gameOdds: OddsEvent,
    fanDuelBookmaker: Bookmaker
): Promise<NewBettingLine> {
    const bettingLineData: NewBettingLine = {
        gameId: gameInDb.id,
        bookmaker: 'fanduel',
        lastUpdated: dayjs.utc(fanDuelBookmaker.last_update).valueOf(),
        createdAt: dayjs.utc().valueOf(),
    };

    // Extract market data
    const h2hMarket = fanDuelBookmaker.markets.find(m => m.key === 'h2h');
    const spreadsMarket = fanDuelBookmaker.markets.find(m => m.key === 'spreads');
    const totalsMarket = fanDuelBookmaker.markets.find(m => m.key === 'totals');

    // Add moneyline data
    if (h2hMarket) {
        const { moneylineHome, moneylineAway } = extractMoneylineData(gameOdds, h2hMarket);
        bettingLineData.moneylineHome = moneylineHome;
        bettingLineData.moneylineAway = moneylineAway;
    }

    // Add spread data
    if (spreadsMarket) {
        const spreadData = extractSpreadData(gameOdds, spreadsMarket);
        Object.assign(bettingLineData, spreadData);
    }

    // Add totals data
    if (totalsMarket) {
        const totalsData = extractTotalsData(totalsMarket);
        Object.assign(bettingLineData, totalsData);
    }

    return bettingLineData;
}

/**
 * Extract moneyline data from h2h market
 */
function extractMoneylineData(gameOdds: OddsEvent, h2hMarket: Market) {
    const homeOutcome = h2hMarket.outcomes.find((o: Outcome) => o.name === gameOdds.home_team);
    const awayOutcome = h2hMarket.outcomes.find((o: Outcome) => o.name === gameOdds.away_team);

    return {
        moneylineHome: homeOutcome?.price || null,
        moneylineAway: awayOutcome?.price || null,
    };
}

/**
 * Extract spread data from spreads market
 */
function extractSpreadData(gameOdds: OddsEvent, spreadsMarket: Market) {
    const homeOutcome = spreadsMarket.outcomes.find((o: Outcome) => o.name === gameOdds.home_team);
    const awayOutcome = spreadsMarket.outcomes.find((o: Outcome) => o.name === gameOdds.away_team);

    return {
        spreadHome: homeOutcome?.point || null,
        spreadAway: awayOutcome?.point || null,
        spreadHomeOdds: homeOutcome?.price || null,
        spreadAwayOdds: awayOutcome?.price || null,
    };
}

/**
 * Extract totals data from totals market
 */
function extractTotalsData(totalsMarket: Market) {
    if (!totalsMarket?.outcomes || totalsMarket.outcomes.length < 2) {
        return {
            totalPoints: null,
            overOdds: null,
            underOdds: null,
        };
    }

    const overOutcome = totalsMarket.outcomes.find((o: Outcome) => o.name === 'Over');
    const underOutcome = totalsMarket.outcomes.find((o: Outcome) => o.name === 'Under');

    return {
        totalPoints: overOutcome?.point || underOutcome?.point || null,
        overOdds: overOutcome?.price || null,
        underOdds: underOutcome?.price || null,
    };
}

/**
 * Save betting line to database with upsert logic
 */
async function saveBettingLine(db: DatabaseConnection, bettingLineData: NewBettingLine) {
    await db
        .insert(bettingLines)
        .values(bettingLineData)
        .onConflictDoUpdate({
            target: [bettingLines.gameId, bettingLines.bookmaker],
            set: {
                spreadHome: bettingLineData.spreadHome,
                spreadAway: bettingLineData.spreadAway,
                spreadHomeOdds: bettingLineData.spreadHomeOdds,
                spreadAwayOdds: bettingLineData.spreadAwayOdds,
                moneylineHome: bettingLineData.moneylineHome,
                moneylineAway: bettingLineData.moneylineAway,
                totalPoints: bettingLineData.totalPoints,
                overOdds: bettingLineData.overOdds,
                underOdds: bettingLineData.underOdds,
                lastUpdated: bettingLineData.lastUpdated,
            },
        });
}

/**
 * Find or create a game in our database by matching team names
 * Since IDs differ between APIs, we match on team names
 */
async function findOrCreateGame(db: DatabaseConnection, gameOdds: OddsEvent): Promise<Game | null> {
    const commenceDate = dayjs.utc(gameOdds.commence_time);
    const dayStart = commenceDate.startOf('day').valueOf();
    const dayEnd = commenceDate.endOf('day').valueOf();

    const existingGames = await db
        .select()
        .from(games)
        .where(eq(games.homeTeam, gameOdds.home_team));

    // Find game with matching away team on the same day
    const matchingGame = existingGames.find(
        (game: Game) =>
            game.awayTeam === gameOdds.away_team &&
            game.gameDate >= dayStart &&
            game.gameDate <= dayEnd
    );

    if (matchingGame) {
        return matchingGame;
    }

    // Create minimal game record if not found
    const newGame = {
        homeTeam: gameOdds.home_team,
        awayTeam: gameOdds.away_team,
        gameDate: commenceDate.valueOf(),
        season: commenceDate.year(),
        status: 'NS',
        createdAt: dayjs.utc().valueOf(),
        updatedAt: dayjs.utc().valueOf(),
    };

    const [insertedGame] = await db.insert(games).values(newGame).returning();
    return insertedGame;
}

// Run the aggregation if this script is executed directly
if (require.main === module) {
    aggregateFootballOdds();
}
