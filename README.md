<img width="851" height="315" alt="image" src="https://github.com/user-attachments/assets/39ed0466-a98b-4177-b61a-250a6a2518f8" />


# LINA - Line Analysis Assistant

A sports betting analysis tool that leverages LLM technology to analyze sports lines and provide intelligent betting recommendations. LINA aggregates sports data from third-party APIs, stores it in a database, and uses AI analysis to identify profitable betting opportunities including straight bets and parlays.

## 🎯 Project Overview

LINA (Line Analysis Assistant) is designed as a modular monorepo application that combines data aggregation, AI analysis, and web presentation for sports betting recommendations. The system follows a layered architecture with clear separation between data collection, processing, analysis, and presentation layers.

### Key Features

- **Automated Data Aggregation**: Fetches current games, odds, player statistics, and injury data from multiple APIs
- **AI-Powered Analysis**: Uses Ollama LLM to analyze game data and generate betting recommendations
- **Intelligent Recommendations**: Identifies both straight bet and parlay opportunities with confidence scoring
- **Web Interface**: React-based dashboard for viewing recommendations and analysis results
- **CLI Tools**: Command-line interface for data management and analysis tasks
- **Monorepo Architecture**: Clean separation of concerns with TypeScript throughout

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External APIs │    │   LINA System   │    │  Presentation   │
│                 │    │                 │    │                 │
│ • Sports APIs   │───>│ • Aggregators   │───>│ • React Web App │
│ • Odds APIs     │    │ • SQLite DB     │    │ • API Server    │
│ • Injury APIs   │    │ • AI Engine     │    │ • CLI Tools     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: SQLite with Drizzle ORM
- **AI/ML**: Ollama with AI SDK
- **Frontend**: React, TypeScript
- **Tooling**: BiomeJS (linting/formatting), npm workspaces
- **APIs**: Sports API, The Odds API

## 📁 Project Structure

```
lina/
├── packages/
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Application constants and enums
│   ├── config/          # Configuration management system
│   ├── database/        # Database schemas, ORM setup, and data mappers
│   ├── tasks/           # Data collection services
│   ├── validation/      # Data validation schemas and functions
│   └── cli/             # Command-line tools for tasks
├── apps/
│   └── dashboard/       # React web application
├── tools/
│   ├── biome.json       # BiomeJS configuration
│   └── tsconfig.json    # Root TypeScript configuration
├── .env.example         # Example environment variables
└── package.json         # Root package.json with workspaces
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Ollama** (for AI analysis)
- **API Keys**:
  - Sports API key from [API-Sports](https://api-sports.io/)
  - The Odds API key from [The Odds API](https://the-odds-api.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lina
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Initialize the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Ollama** (if not already running)
   ```bash
   ollama serve
   ollama pull llama3.1:8b  # or your preferred model
   ```

6. **Start the development environment**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
SPORTS_API_KEY=your_sports_api_key_here
ODDS_API_KEY=your_odds_api_key_here

# Database Configuration
DATABASE_PATH=./db/lina.db

# AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Server Configuration
API_PORT=3001
WEB_PORT=3000
```

### Configuration Files

The application uses TypeScript configuration files for different components:

- `packages/config/apis.config.ts` - API endpoints and rate limiting
- `packages/config/aggregation.config.ts` - Data collection settings
- `packages/config/ai.config.ts` - AI analysis parameters
- `packages/config/database.config.ts` - Database connection settings

Example configuration:

```typescript
// packages/config/aggregation.config.ts
export const aggregationConfig = {
  sports: [
    {
      key: 'americanfootball_nfl',
      leagueId: 1,
      enabled: true,
    },
  ],
  schedule: {
    games: '0 */6 * * *',      // Every 6 hours
    odds: '*/15 * * * *',      // Every 15 minutes
    injuries: '0 */2 * * *',   // Every 2 hours
  },
};
```

## 🔧 CLI Commands

### Data Aggregation

```bash
# Aggregate games for today
npm run cli aggregate:games

# Aggregate games for specific date range
npm run cli aggregate:games --from=2024-01-01 --to=2024-01-07

# Aggregate odds data
npm run cli aggregate:odds --sport=americanfootball_nfl

# Aggregate injury data
npm run cli aggregate:injuries --team=1

# Aggregate player statistics
npm run cli aggregate:statistics --season=2024
```

### AI Analysis

```bash
# Analyze specific game
npm run cli analyze:game --game-id=12345

# Batch analyze games for date
npm run cli analyze:batch --date=2024-01-15

# Generate recommendations
npm run cli analyze:recommendations --confidence=0.7

# Compare analysis iterations
npm run cli analyze:compare --game-id=12345
```

### Database Management

```bash
# Run database migrations
npm run cli db:migrate

# Backup database
npm run cli db:backup

# Restore from backup
npm run cli db:restore --file=backup-2024-01-15.db

# Clean old data
npm run cli db:cleanup --days=30

# Database health check
npm run cli db:health
```

### Configuration Management

```bash
# Validate configuration
npm run cli config:validate

# Show current configuration
npm run cli config:show

# Test API connections
npm run cli config:test-apis
```

## 🌐 API Endpoints

### Games and Teams

```
GET    /api/v1/games                    # List games with filtering
GET    /api/v1/games/:id               # Get specific game details
GET    /api/v1/teams                   # List teams
GET    /api/v1/teams/:id               # Get team information
GET    /api/v1/teams/:id/statistics    # Get team statistics
```

### Analysis and Recommendations

```
GET    /api/v1/analysis                # List analysis results
GET    /api/v1/analysis/:id            # Get specific analysis
POST   /api/v1/analysis                # Trigger new analysis
GET    /api/v1/recommendations         # List recommendations
GET    /api/v1/recommendations/:id     # Get specific recommendation
```

### Odds and Betting Lines

```
GET    /api/v1/odds                    # List current odds
GET    /api/v1/odds/:event-id          # Get odds for specific event
GET    /api/v1/odds/history            # Historical odds data
GET    /api/v1/bookmakers              # List available bookmakers
```

### System and Health

```
GET    /api/v1/health                  # System health check
GET    /api/v1/status                  # Application status
GET    /api/v1/config                  # Configuration info (non-sensitive)
```

## 🛠️ Development Workflow

### Getting Started

1. **Fork and clone** the repository
2. **Create a feature branch** from `main`
3. **Install dependencies** with `npm install`
4. **Set up environment** variables
5. **Run tests** to ensure everything works

### Development Commands

```bash
# Start development servers
npm run dev                    # Start all services
npm run dev:api               # Start API server only
npm run dev:web               # Start web app only
npm run dev:cli               # Development CLI mode

# Code quality
npm run lint                  # Run BiomeJS linting
npm run format               # Format code with BiomeJS
npm run type-check           # TypeScript type checking

# Testing
npm run test                 # Run all tests
npm run test:unit            # Unit tests only
npm run test:integration     # Integration tests only
npm run test:e2e             # End-to-end tests

# Database
npm run db:migrate           # Run migrations
npm run db:seed              # Seed test data
npm run db:reset             # Reset database
npm run db:studio            # Open database studio
```

### Code Standards

- **TypeScript**: All code must be written in TypeScript with strict mode enabled
- **Linting**: Code must pass BiomeJS linting rules
- **Testing**: New features require unit tests with >80% coverage
- **Documentation**: Public APIs must have JSDoc comments
- **Commits**: Use conventional commit messages

### Testing Strategy

```bash
# Unit tests for individual components
npm run test:unit packages/database
npm run test:unit packages/ai-engine

# Integration tests for API endpoints
npm run test:integration apps/api-server

# End-to-end tests for complete workflows
npm run test:e2e
```

## 📊 Data Flow

1. **Data Aggregation**: CLI tools fetch data from Sports API and Odds API
2. **Data Transformation**: Inbound mappers convert API responses to database entities
3. **Data Storage**: Drizzle ORM stores normalized data in SQLite
4. **AI Analysis**: Analysis engine processes game data through Ollama
5. **Recommendation Generation**: AI generates betting recommendations with confidence scores
6. **API Serving**: Express server provides REST API for frontend consumption
7. **Web Presentation**: React app displays recommendations and analysis results

## 🤝 Contributing

### Pull Request Process

1. **Create feature branch** from `main`
2. **Implement changes** following code standards
3. **Add/update tests** for new functionality
4. **Update documentation** if needed
5. **Run full test suite** and ensure all checks pass
6. **Submit pull request** with clear description

### Code Review Guidelines

- All code changes require review from at least one maintainer
- Tests must pass and coverage must not decrease
- Documentation must be updated for API changes
- Breaking changes require discussion and migration plan

### Issue Reporting

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Relevant logs or error messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [API-Sports](https://api-sports.io/) for sports data
- [The Odds API](https://the-odds-api.com/) for betting odds
- [Ollama](https://ollama.ai/) for local LLM inference
- [Drizzle ORM](https://orm.drizzle.team/) for database management

---

For more detailed information, see the documentation in the `docs/` directory or visit our [wiki](link-to-wiki).
