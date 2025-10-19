import { relations } from "drizzle-orm";
import {
    sqliteTable,
    integer,
    text,
    real,
    unique,
} from "drizzle-orm/sqlite-core";
import { events } from "./events.schema";

/**
 * Odds Schema - Stores betting odds for events
 * Each row represents a single betting outcome (e.g., "Jacksonville Jaguars -110 at +3")
 */
export const odds = sqliteTable(
    "odds",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        eventId: integer("event_id")
            .notNull()
            .references(() => events.id),
        market: text("market").notNull(), // h2h, spreads, totals, alternate_spreads, etc.
        name: text("name").notNull(), // Team name, "Over", "Under", etc.
        price: real("price").notNull(), // American odds (e.g., -110, +150)
        point: real("point"), // Spread/total line (e.g., 3.5, 44.5)
        createdAt: integer("created_at").notNull(),
        updatedAt: integer("updated_at").notNull(),
    },
    (table) => ({
        // Unique constraint: same event, market, name, and point combo
        uniqueOdd: unique().on(
            table.eventId,
            table.market,
            table.name,
            table.point
        ),
    })
);

// Define relationships
export const oddsRelations = relations(odds, ({ one }) => ({
    event: one(events, {
        fields: [odds.eventId],
        references: [events.id],
    }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
    odds: many(odds),
}));

export type Odd = typeof odds.$inferSelect;
export type NewOdd = typeof odds.$inferInsert;
