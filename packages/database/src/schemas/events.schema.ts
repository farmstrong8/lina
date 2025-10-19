import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
    id: integer('id').primaryKey(),
    eventId: text('event_id').notNull().unique(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    startTime: integer('start_time').notNull(), // Unix timestamp
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
