import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
