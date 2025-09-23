import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Games Schema - API Agnostic
 * Stores core game information regardless of data source
 */
export const games = sqliteTable('games', {
    id: integer('id').primaryKey(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    gameDate: integer('game_date').notNull(), // Unix timestamp
    week: integer('week'),
    season: integer('season').notNull(),
    status: text('status').notNull(), // NS, IP, FT, PPD, CANC
    homeScore: integer('home_score'),
    awayScore: integer('away_score'),
    venue: text('venue'),
    weatherConditions: text('weather_conditions'),
    surfaceType: text('surface_type'), // grass, turf, etc
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

/**
 * Teams Schema - Basic team information
 */
export const teams = sqliteTable('teams', {
    id: integer('id').primaryKey(),
    name: text('name').notNull().unique(),
    city: text('city').notNull(),
    abbreviation: text('abbreviation').notNull().unique(),
    conference: text('conference'), // AFC, NFC
    division: text('division'), // North, South, East, West
    primaryColor: text('primary_color'),
    secondaryColor: text('secondary_color'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

/**
 * Player Injuries Schema - Track injury status affecting game outcomes
 */
export const playerInjuries = sqliteTable('player_injuries', {
    id: integer('id').primaryKey(),
    playerName: text('player_name').notNull(),
    team: text('team').notNull(),
    position: text('position'),
    injuryStatus: text('injury_status').notNull(), // OUT, DOUBTFUL, QUESTIONABLE, PROBABLE
    bodyPart: text('body_part'),
    description: text('description'),
    gameId: integer('game_id').references(() => games.id),
    reportedAt: integer('reported_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type PlayerInjury = typeof playerInjuries.$inferSelect;
export type NewPlayerInjury = typeof playerInjuries.$inferInsert;
