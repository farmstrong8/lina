import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { games } from './games.schema';

/**
 * Betting Lines Schema - API Agnostic
 * Stores FanDuel betting data regardless of API source
 */
export const bettingLines = sqliteTable('betting_lines', {
    id: integer('id').primaryKey(),
    gameId: integer('game_id')
        .notNull()
        .references(() => games.id),

    // Spread betting
    spreadHome: real('spread_home'), // e.g., -3.5 for home team
    spreadAway: real('spread_away'), // e.g., +3.5 for away team
    spreadHomeOdds: integer('spread_home_odds'), // American odds e.g., -110
    spreadAwayOdds: integer('spread_away_odds'), // American odds e.g., -110

    // Moneyline betting
    moneylineHome: integer('moneyline_home'), // American odds e.g., -150
    moneylineAway: integer('moneyline_away'), // American odds e.g., +130

    // Totals (Over/Under) betting
    totalPoints: real('total_points'), // e.g., 47.5
    overOdds: integer('over_odds'), // American odds e.g., -110
    underOdds: integer('under_odds'), // American odds e.g., -110

    // Metadata
    bookmaker: text('bookmaker').notNull().default('fanduel'),
    lastUpdated: integer('last_updated').notNull(),
    createdAt: integer('created_at').notNull(),
});

/**
 * AI Analysis Results Schema
 * Stores LLM analysis and recommendations with versioning
 */
export const aiAnalyses = sqliteTable('ai_analyses', {
    id: integer('id').primaryKey(),
    gameId: integer('game_id')
        .notNull()
        .references(() => games.id),
    analysisVersion: integer('analysis_version').notNull().default(1),

    // Analysis metadata
    confidence: real('confidence').notNull(), // 0.0 to 1.0
    modelUsed: text('model_used').notNull(), // e.g., 'llama3.1:8b'
    promptVersion: text('prompt_version'),

    // Analysis content
    reasoning: text('reasoning').notNull(),
    keyFactors: text('key_factors'), // JSON array of factors considered

    // Game context used
    homeTeamForm: text('home_team_form'), // JSON with recent performance
    awayTeamForm: text('away_team_form'), // JSON with recent performance
    injuryImpact: text('injury_impact'), // JSON with injury analysis
    weatherImpact: text('weather_impact'),

    createdAt: integer('created_at').notNull(),
});

/**
 * AI Recommendations Schema
 * Stores specific betting recommendations from AI analysis
 */
export const aiRecommendations = sqliteTable('ai_recommendations', {
    id: integer('id').primaryKey(),
    analysisId: integer('analysis_id')
        .notNull()
        .references(() => aiAnalyses.id),

    // Recommendation details
    betType: text('bet_type').notNull(), // spread, moneyline, total, parlay
    pick: text('pick').notNull(), // home, away, over, under, or specific pick
    confidence: real('confidence').notNull(), // 0.0 to 1.0
    expectedValue: real('expected_value'), // Expected value calculation

    // Betting specifics
    recommendedOdds: integer('recommended_odds'), // American odds
    stake: real('stake'), // Recommended bet amount (1-10 scale)
    reasoning: text('reasoning').notNull(),

    // Parlay specific
    parlayGroupId: text('parlay_group_id'), // Groups bets for parlay

    createdAt: integer('created_at').notNull(),
});

export type BettingLine = typeof bettingLines.$inferSelect;
export type NewBettingLine = typeof bettingLines.$inferInsert;
export type AiAnalysis = typeof aiAnalyses.$inferSelect;
export type NewAiAnalysis = typeof aiAnalyses.$inferInsert;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type NewAiRecommendation = typeof aiRecommendations.$inferInsert;
