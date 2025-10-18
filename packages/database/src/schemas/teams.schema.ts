import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;