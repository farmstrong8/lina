# LINA CLI Documentation

The LINA CLI provides command-line tools for data aggregation, AI analysis, and system maintenance.

## Installation

The CLI is included with the main LINA installation. After setting up the project, you can use:

```bash
npm run cli <command>
```

Or install globally (future):
```bash
npm install -g @lina/cli
lina <command>
```

## Global Options

All commands support these global options:

- `--config <path>` - Custom configuration file path
- `--env <environment>` - Environment (development, production, test)
- `--verbose` - Enable verbose logging
- `--quiet` - Suppress non-error output
- `--dry-run` - Show what would be done without executing
- `--help` - Show help information

## Commands

### Configuration Management

#### `config validate`

Validate the current configuration.

```bash
npm run cli config validate

# Options:
--config <path>    # Custom config file
--env <env>        # Target environment
```

**Example Output:**
```
✓ Configuration is valid
✓ API keys are present
✓ Database path is accessible
✓ Ollama connection successful
```

#### `config show`

Display current configuration (sensitive values masked).

```bash
npm run cli config show

# Options:
--section <name>   # Show specific section (apis, database, ai)
--format <type>    # Output format (json, yaml, table)
```

#### `config test-apis`

Test connectivity to external APIs.

```bash
npm run cli config test-apis

# Options:
--api <name>       # Test specific API (sports, odds)
--timeout <ms>     # Request timeout
```

### Data Aggregation

#### `aggregate games`

Aggregate games data from Sports API.

```bash
npm run cli aggregate games

# Options:
--date <date>      # Specific date (YYYY-MM-DD)
--from <date>      # Start date for range
--to <date>        # End date for range
--league <id>      # Specific league ID
--season <year>    # Season year
--force            # Force re-aggregation of existing data
```

**Examples:**
```bash
# Aggregate today's games
npm run cli aggregate games

# Aggregate specific date
npm run cli aggregate games --date 2024-01-15

# Aggregate date range
npm run cli aggregate games --from 2024-01-01 --to 2024-01-07

# Aggregate NFL games only
npm run cli aggregate games --league 1

# Force re-aggregation
npm run cli aggregate games --date 2024-01-15 --force
```

#### `aggregate odds`

Aggregate odds data from The Odds API.

```bash
npm run cli aggregate odds

# Options:
--sport <key>      # Sport key (americanfootball_nfl)
--region <code>    # Region code (us, us2, uk)
--market <type>    # Market type (h2h, spreads, totals)
--bookmaker <key>  # Specific bookmaker
--event <id>       # Specific event ID
```

**Examples:**
```bash
# Aggregate all NFL odds
npm run cli aggregate odds --sport americanfootball_nfl

# Aggregate specific markets
npm run cli aggregate odds --sport americanfootball_nfl --market h2h,spreads

# Aggregate from specific regions
npm run cli aggregate odds --sport americanfootball_nfl --region us,us2
```

#### `aggregate injuries`

Aggregate player injury data.

```bash
npm run cli aggregate injuries

# Options:
--team <id>        # Specific team ID
--league <id>      # Specific league ID
--season <year>    # Season year
--active-only      # Only active injuries
```

#### `aggregate statistics`

Aggregate player statistics.

```bash
npm run cli aggregate statistics

# Options:
--player <id>      # Specific player ID
--team <id>        # Specific team ID
--season <year>    # Season year
--group <name>     # Statistics group (offense, defense)
```

#### `aggregate all`

Run all aggregation tasks in sequence.

```bash
npm run cli aggregate all

# Options:
--date <date>      # Target date
--league <id>      # Specific league
--parallel         # Run tasks in parallel (faster but more resource intensive)
```

### AI Analysis

#### `analyze game`

Analyze a specific game using AI.

```bash
npm run cli analyze game <game-id>

# Options:
--model <name>     # Ollama model to use
--iterations <n>   # Number of analysis iterations (default: 1)
--confidence <n>   # Minimum confidence threshold (0.0-1.0)
--include-parlay   # Include parlay recommendations
--save-result      # Save analysis to database
```

**Examples:**
```bash
# Analyze specific game
npm run cli analyze game 12345

# Multiple iterations for comparison
npm run cli analyze game 12345 --iterations 3

# High confidence threshold
npm run cli analyze game 12345 --confidence 0.8 --include-parlay
```

#### `analyze batch`

Analyze multiple games in batch.

```bash
npm run cli analyze batch

# Options:
--date <date>      # Analyze games for specific date
--league <id>      # Analyze games for specific league
--team <id>        # Analyze games for specific team
--status <status>  # Game status filter (NS, LIVE, FT)
--parallel <n>     # Number of parallel analyses (default: 1)
--confidence <n>   # Minimum confidence threshold
```

**Examples:**
```bash
# Analyze all games for today
npm run cli analyze batch --date $(date +%Y-%m-%d)

# Analyze upcoming NFL games
npm run cli analyze batch --league 1 --status NS

# Parallel analysis (faster)
npm run cli analyze batch --date 2024-01-15 --parallel 3
```

#### `analyze recommendations`

Generate recommendations from existing analyses.

```bash
npm run cli analyze recommendations

# Options:
--game <id>        # Specific game
--confidence <n>   # Minimum confidence threshold
--type <type>      # Recommendation type (straight_bet, parlay)
--format <format>  # Output format (table, json, csv)
```

#### `analyze compare`

Compare multiple analysis iterations for a game.

```bash
npm run cli analyze compare <game-id>

# Options:
--iterations <ids> # Specific iteration IDs to compare
--format <format>  # Output format (table, json)
--show-diff        # Highlight differences
```

### Database Management

#### `db migrate`

Run database migrations.

```bash
npm run cli db migrate

# Options:
--to <version>     # Migrate to specific version
--rollback         # Rollback last migration
--dry-run          # Show SQL without executing
```

#### `db seed`

Seed database with initial data.

```bash
npm run cli db seed

# Options:
--file <path>      # Specific seed file
--clear            # Clear existing data first
--test-data        # Include test data
```

#### `db backup`

Create database backup.

```bash
npm run cli db backup

# Options:
--output <path>    # Backup file path
--compress         # Compress backup file
--include-logs     # Include log tables
```

**Example:**
```bash
# Create timestamped backup
npm run cli db backup

# Custom backup location
npm run cli db backup --output ./backups/manual-backup.db

# Compressed backup
npm run cli db backup --compress
```

#### `db restore`

Restore database from backup.

```bash
npm run cli db restore <backup-file>

# Options:
--confirm          # Skip confirmation prompt
--preserve-logs    # Keep current log data
```

#### `db cleanup`

Clean up old data from database.

```bash
npm run cli db cleanup

# Options:
--days <n>         # Keep data newer than N days (default: 90)
--tables <list>    # Specific tables to clean
--dry-run          # Show what would be deleted
```

#### `db health`

Check database health and statistics.

```bash
npm run cli db health

# Options:
--detailed         # Show detailed statistics
--check-integrity  # Run integrity checks
--format <format>  # Output format (table, json)
```

**Example Output:**
```
Database Health Report
=====================

Connection: ✓ Connected
Size: 245.7 MB
Tables: 15
Records: 125,430

Table Statistics:
┌─────────────────┬─────────┬──────────────┐
│ Table           │ Records │ Size (MB)    │
├─────────────────┼─────────┼──────────────┤
│ games           │ 1,250   │ 12.3         │
│ odds_outcomes   │ 45,230  │ 156.7        │
│ ai_analyses     │ 450     │ 23.1         │
└─────────────────┴─────────┴──────────────┘

Integrity: ✓ All checks passed
Performance: ✓ Indexes optimized
```

### System Maintenance

#### `system status`

Show system status and health.

```bash
npm run cli system status

# Options:
--services         # Check external service connectivity
--detailed         # Show detailed metrics
--format <format>  # Output format
```

#### `system logs`

View and manage application logs.

```bash
npm run cli system logs

# Options:
--level <level>    # Log level filter (error, warn, info, debug)
--since <time>     # Show logs since timestamp
--tail <n>         # Show last N lines
--follow           # Follow log output
--component <name> # Filter by component
```

#### `system cache`

Manage application cache.

```bash
npm run cli system cache

# Subcommands:
clear              # Clear all cache
stats              # Show cache statistics
prune              # Remove expired entries
```

### Development Tools

#### `dev generate`

Generate development data and fixtures.

```bash
npm run cli dev generate

# Options:
--type <type>      # Data type (games, odds, analyses)
--count <n>        # Number of records to generate
--date <date>      # Target date for generated data
```

#### `dev test-workflow`

Test complete data workflow.

```bash
npm run cli dev test-workflow

# Options:
--skip-aggregation # Skip data aggregation step
--skip-analysis    # Skip AI analysis step
--game-id <id>     # Test with specific game
```

## Configuration File

The CLI can use a configuration file to set default options:

```yaml
# .lina-cli.yml
defaults:
  aggregation:
    league: 1
    parallel: true
  analysis:
    confidence: 0.7
    iterations: 2
  database:
    backup_retention: 30
```

## Environment Variables

CLI-specific environment variables:

```bash
# CLI Configuration
LINA_CLI_CONFIG_PATH=./config/cli.yml
LINA_CLI_LOG_LEVEL=info
LINA_CLI_OUTPUT_FORMAT=table

# Override API settings
LINA_CLI_SPORTS_API_KEY=override_key
LINA_CLI_ODDS_API_KEY=override_key
```

## Scripting and Automation

### Cron Jobs

Example cron jobs for automated data collection:

```bash
# Aggregate games every 6 hours
0 */6 * * * cd /path/to/lina && npm run cli aggregate games

# Aggregate odds every 15 minutes
*/15 * * * * cd /path/to/lina && npm run cli aggregate odds

# Daily analysis at 6 AM
0 6 * * * cd /path/to/lina && npm run cli analyze batch --date $(date +%Y-%m-%d)

# Weekly database cleanup
0 2 * * 0 cd /path/to/lina && npm run cli db cleanup --days 90
```

### Shell Scripts

Example automation script:

```bash
#!/bin/bash
# daily-update.sh

set -e

echo "Starting daily LINA update..."

# Aggregate today's data
npm run cli aggregate games --date $(date +%Y-%m-%d)
npm run cli aggregate odds --sport americanfootball_nfl
npm run cli aggregate injuries

# Run AI analysis
npm run cli analyze batch --date $(date +%Y-%m-%d) --parallel 2

# Backup database
npm run cli db backup --compress

echo "Daily update completed successfully"
```

## Troubleshooting

### Common Issues

**API Connection Errors:**
```bash
# Test API connectivity
npm run cli config test-apis

# Check configuration
npm run cli config validate
```

**Database Issues:**
```bash
# Check database health
npm run cli db health --detailed

# Run integrity check
npm run cli db health --check-integrity
```

**AI Analysis Failures:**
```bash
# Test Ollama connection
curl http://localhost:11434/api/version

# Check model availability
ollama list
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=lina:* npm run cli <command>
```

### Log Files

CLI logs are written to:
- `logs/cli.log` - General CLI logs
- `logs/aggregation.log` - Data aggregation logs
- `logs/analysis.log` - AI analysis logs
- `logs/error.log` - Error logs