# LINA Architecture Documentation

## Overview

LINA (Line Analysis Assistant) is a focused, personal sports betting analysis tool built with a clean monorepo architecture. The system is designed around three core principles:

1. **API Independence** - Database schemas are agnostic of external API structures
2. **Task-Based Execution** - Data collection runs as independent, schedulable tasks
3. **Focused Scope** - Built specifically for NFL analysis with FanDuel betting

## Architecture Philosophy

### Simplicity Over Enterprise Patterns
- No over-engineered abstractions or complex layering
- Direct, purposeful code that solves specific problems
- Minimal dependencies and focused responsibilities

### API-Agnostic Design
- External APIs can be swapped without changing core data models
- Clean separation between data ingestion and storage
- Standardized internal schemas regardless of source format

### Task-Based Approach
- Data aggregation runs as independent scripts
- Each task has a single, well-defined responsibility
- Easy to schedule, monitor, and debug individually

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        LINA System                          │
├─────────────────────────────────────────────────────────────┤
│  Tasks/           │  Packages/                              │
│  ┌─────────────┐  │  ┌─────────────┐  ┌─────────────┐      │
│  │ odds-       │  │  │ odds-api    │  │ football-   │      │
│  │ aggregator  │──┼──│ (FanDuel)   │  │ api (NFL)   │      │
│  └─────────────┘  │  └─────────────┘  └─────────────┘      │
│  ┌─────────────┐  │  ┌─────────────┐  ┌─────────────┐      │
│  │ football-   │  │  │ database    │  │ ai-engine   │      │
│  │ aggregator  │──┼──│ (Drizzle)   │  │ (Ollama)    │      │
│  └─────────────┘  │  └─────────────┘  └─────────────┘      │
│                   │  ┌─────────────┐                       │
│                   │  │ types       │                       │
│                   │  │ (Shared)    │                       │
│                   │  └─────────────┘                       │
├─────────────────────────────────────────────────────────────┤
│  Apps/                                                      │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ api-server  │  │ web         │                          │
│  │ (Express)   │  │ (Next.js)   │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Package Structure

### Core Packages

#### `@lina/types`
**Purpose**: Centralized TypeScript types and application constants
- All shared interfaces and type definitions
- API endpoints, rate limits, and configuration constants
- Database type inference from Drizzle schemas
- No runtime dependencies, pure types and constants

#### `@lina/database`
**Purpose**: API-agnostic data layer with Drizzle ORM
- Clean, normalized schemas for games, teams, betting lines
- SQLite database with WAL mode for performance
- Schemas designed around business logic, not API structure
- Type-safe database operations

#### `@lina/odds-api`
**Purpose**: Singleton client for The Odds API (FanDuel focus)
- Rate limiting and retry logic built-in
- Focused exclusively on FanDuel bookmaker
- Placeholder types ready for actual API response structures
- Singleton pattern ensures single connection per process

#### `@lina/football-api`
**Purpose**: Singleton client for API-American-Football
- NFL-specific data: games, teams, player stats, injuries
- RapidAPI headers and authentication handling
- Rate limiting tailored to API constraints
- Clean interface for football-specific data needs

#### `@lina/ai-engine`
**Purpose**: LLM analysis using Ollama + AI SDK
- Prompt engineering for sports betting analysis
- Integration with local Ollama models
- Analysis result storage with versioning
- Recommendation generation for straight bets and parlays

### Task Applications

#### `tasks/odds-aggregator`
**Purpose**: Fetch and store FanDuel betting lines
```bash
npm run aggregator:odds
```
- Connects to OddsApi client
- Transforms API responses to internal schemas
- Stores in `bettingLines` table
- Handles rate limiting and error recovery

#### `tasks/football-aggregator`
**Purpose**: Fetch and store NFL game/player data
```bash
npm run aggregator:football
```
- Connects to Football API client
- Fetches games, team stats, injury reports
- Stores in `games`, `teams`, `playerInjuries` tables
- Coordinates multiple API endpoints

### Application Layer

#### `apps/api-server`
**Purpose**: REST API for data access
- Express.js server with TypeScript
- Endpoints for games, odds, analysis results
- CORS and security middleware
- JSON API responses

#### `apps/web`
**Purpose**: React frontend for data visualization
- Next.js application with TypeScript
- Charts and tables for game analysis
- AI recommendation display
- Responsive design for mobile/desktop

## Data Flow

### 1. Data Ingestion
```
External APIs → Singleton Clients → Task Scripts → Database Schemas
```

### 2. Analysis Pipeline
```
Database → AI Engine → Ollama LLM → Analysis Results → Database
```

### 3. User Interface
```
Database → API Server → Web Frontend → User
```

## Database Schema Design

### Core Entities

**Games Table**
- API-agnostic game information
- Home/away teams, date, status, scores
- Weather and venue details
- Created/updated timestamps

**Teams Table**
- Basic team information
- Conference/division structure
- Branding colors for UI

**Betting Lines Table**
- FanDuel-specific odds data
- Spread, moneyline, totals betting
- American odds format
- Last updated tracking

**Player Injuries Table**
- Injury status affecting game outcomes
- Position and severity information
- Linked to specific games when relevant

**AI Analysis Tables**
- Analysis results with confidence scores
- Model and prompt version tracking
- Detailed reasoning and key factors
- Recommendation storage with expected value

## Development Guidelines

### Adding New API Sources
1. Create new package in `packages/` (e.g., `@lina/new-api`)
2. Implement singleton client with rate limiting
3. Add TypeScript path mapping in `tsconfig.json`
4. Create corresponding task in `tasks/`
5. Update database schemas if needed (avoid API-specific fields)

### Database Schema Changes
1. Modify schemas in `packages/database/src/schemas/`
2. Generate migration with `npm run db:generate`
3. Test migration with `npm run db:migrate`
4. Update TypeScript types are automatically inferred

### Task Development
1. Tasks should be independent and idempotent
2. Include proper error handling and logging
3. Use environment variables for API keys
4. Transform API responses to match internal schemas
5. Handle rate limiting through singleton clients

### API Client Development
1. Use singleton pattern for connection management
2. Implement rate limiting based on API constraints
3. Include retry logic with exponential backoff
4. Type API responses but keep internal schemas agnostic
5. Provide debugging/monitoring methods (like `getStats()`)

## Configuration

### Environment Variables
```bash
ODDS_API_KEY=your_odds_api_key
FOOTBALL_API_KEY=your_rapidapi_key
DATABASE_URL=./db/lina.db  # Optional, has default
```

### TypeScript Paths
All packages use `@lina/*` imports configured in `tsconfig.json`:
```json
{
  "paths": {
    "@lina/types": ["./packages/types/src"],
    "@lina/database": ["./packages/database/src"],
    "@lina/odds-api": ["./packages/odds-api/src"],
    "@lina/football-api": ["./packages/football-api/src"],
    "@lina/ai-engine": ["./packages/ai-engine/src"]
  }
}
```

### NPM Scripts
```bash
npm run aggregator:odds      # Fetch FanDuel odds
npm run aggregator:football  # Fetch NFL data
npm run typecheck           # Validate TypeScript
npm run lint               # Check code style
npm run db:studio          # Open Drizzle Studio
```

## Deployment Strategy

### Development
- Run tasks manually or via cron
- Use `npm run db:studio` for database inspection
- Local Ollama instance for AI analysis

### Production
- Schedule tasks via cron or task scheduler
- Environment-specific database paths
- Monitoring and alerting for failed tasks
- Log aggregation for debugging

## Future Considerations

### Scaling
- Tasks can run on separate machines if needed
- Database can be upgraded from SQLite to PostgreSQL
- API clients already handle rate limiting

### Extensibility
- New bookmakers: extend betting lines schema
- New sports: add league constants and schemas
- New analysis models: version tracking already built-in

### Monitoring
- Task execution logs and status tracking
- API rate limit monitoring through client stats
- Database performance metrics via Drizzle

---

## Key Principles to Remember

1. **Keep it simple** - Avoid over-engineering for personal use
2. **API independence** - External changes shouldn't break internal logic
3. **Task focus** - Each script does one thing well
4. **Type safety** - Leverage TypeScript throughout the stack
5. **Extensible foundation** - Built to grow with changing needs

This architecture provides a solid foundation that can evolve from a personal tool to a more sophisticated system while maintaining simplicity and clarity.
