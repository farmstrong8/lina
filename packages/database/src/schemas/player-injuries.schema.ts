import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { games } from "./games.schema"

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


export type PlayerInjury = typeof playerInjuries.$inferSelect;
export type NewPlayerInjury = typeof playerInjuries.$inferInsert;