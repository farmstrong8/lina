# LINA API Documentation

This document provides detailed information about the LINA REST API endpoints.

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

Currently, the API does not require authentication for development. In production, JWT tokens will be required for certain endpoints.

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* additional error details */ }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Endpoints

### Games and Teams

#### GET /games

Retrieve a list of games with optional filtering.

**Query Parameters:**
- `date` (string): Filter by date (YYYY-MM-DD)
- `league` (number): Filter by league ID
- `team` (number): Filter by team ID
- `status` (string): Filter by game status
- `limit` (number): Number of results (default: 50, max: 100)
- `offset` (number): Pagination offset (default: 0)

**Example Request:**
```bash
GET /api/v1/games?date=2024-01-15&league=1&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "games": [
      {
        "id": 12345,
        "homeTeam": {
          "id": 1,
          "name": "Kansas City Chiefs",
          "logo": "https://example.com/chiefs-logo.png"
        },
        "awayTeam": {
          "id": 2,
          "name": "Buffalo Bills",
          "logo": "https://example.com/bills-logo.png"
        },
        "startTime": "2024-01-15T18:00:00Z",
        "status": {
          "short": "NS",
          "long": "Not Started"
        },
        "venue": {
          "name": "Arrowhead Stadium",
          "city": "Kansas City"
        },
        "league": {
          "id": 1,
          "name": "NFL",
          "season": "2024"
        }
      }
    ],
    "pagination": {
      "total": 16,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### GET /games/:id

Retrieve detailed information about a specific game.

**Path Parameters:**
- `id` (number): Game ID

**Example Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "id": 12345,
      "homeTeam": { /* team details */ },
      "awayTeam": { /* team details */ },
      "startTime": "2024-01-15T18:00:00Z",
      "status": { /* status details */ },
      "venue": { /* venue details */ },
      "league": { /* league details */ },
      "scores": {
        "home": {
          "quarter1": 7,
          "quarter2": 14,
          "quarter3": 3,
          "quarter4": 10,
          "total": 34
        },
        "away": {
          "quarter1": 3,
          "quarter2": 7,
          "quarter3": 14,
          "quarter4": 7,
          "total": 31
        }
      },
      "odds": {
        "spread": {
          "home": -3.5,
          "away": 3.5
        },
        "moneyline": {
          "home": -180,
          "away": 150
        },
        "total": {
          "points": 47.5,
          "over": -110,
          "under": -110
        }
      }
    }
  }
}
```

### Analysis and Recommendations

#### GET /analysis

Retrieve AI analysis results.

**Query Parameters:**
- `gameId` (number): Filter by game ID
- `confidence` (number): Minimum confidence threshold (0.0-1.0)
- `type` (string): Analysis type filter
- `limit` (number): Number of results
- `offset` (number): Pagination offset

**Example Response:**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "analysis-uuid",
        "gameId": 12345,
        "confidence": 0.85,
        "expectedValue": 0.12,
        "reasoning": "Based on historical performance and current injuries...",
        "recommendations": [
          {
            "type": "straight_bet",
            "betType": "spread",
            "recommendation": "home",
            "confidence": 0.85,
            "expectedValue": 0.12,
            "reasoning": "Home team has strong record against the spread..."
          }
        ],
        "iteration": 1,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### POST /analysis

Trigger a new AI analysis for a game.

**Request Body:**
```json
{
  "gameId": 12345,
  "analysisType": "full_analysis",
  "options": {
    "includeParlay": true,
    "confidenceThreshold": 0.7
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysisId": "analysis-uuid",
    "status": "queued",
    "estimatedCompletion": "2024-01-15T10:35:00Z"
  }
}
```

### Odds and Betting Lines

#### GET /odds

Retrieve current odds data.

**Query Parameters:**
- `eventId` (string): Odds API event ID
- `sport` (string): Sport key
- `bookmaker` (string): Bookmaker key
- `market` (string): Market type (h2h, spreads, totals)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "odds": [
      {
        "eventId": "event-uuid",
        "sport": "americanfootball_nfl",
        "homeTeam": "Kansas City Chiefs",
        "awayTeam": "Buffalo Bills",
        "commenceTime": "2024-01-15T18:00:00Z",
        "bookmakers": [
          {
            "key": "draftkings",
            "title": "DraftKings",
            "markets": {
              "h2h": [
                {
                  "name": "Kansas City Chiefs",
                  "price": -180
                },
                {
                  "name": "Buffalo Bills",
                  "price": 150
                }
              ],
              "spreads": [
                {
                  "name": "Kansas City Chiefs",
                  "price": -110,
                  "point": -3.5
                },
                {
                  "name": "Buffalo Bills",
                  "price": -110,
                  "point": 3.5
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

### System Endpoints

#### GET /health

System health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "services": {
      "database": "connected",
      "ollama": "available",
      "sportsApi": "reachable",
      "oddsApi": "reachable"
    },
    "version": "1.0.0",
    "uptime": 3600
  }
}
```

#### GET /status

Detailed application status.

**Response:**
```json
{
  "success": true,
  "data": {
    "application": {
      "name": "LINA API",
      "version": "1.0.0",
      "environment": "development",
      "nodeVersion": "18.17.0"
    },
    "database": {
      "status": "connected",
      "totalGames": 1250,
      "totalAnalyses": 450,
      "lastUpdate": "2024-01-15T09:45:00Z"
    },
    "aggregation": {
      "lastRun": "2024-01-15T09:00:00Z",
      "nextScheduled": "2024-01-15T15:00:00Z",
      "status": "idle"
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Resource not found |
| `DATABASE_ERROR` | Database operation failed |
| `API_ERROR` | External API error |
| `AI_ERROR` | AI analysis error |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Default**: 1000 requests per hour per IP
- **Burst**: Up to 100 requests per minute
- **Headers**: Rate limit information in response headers

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Pagination

List endpoints support pagination using `limit` and `offset` parameters:

```json
{
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

**Filtering:**
- Use query parameters for basic filtering
- Multiple values: `?team=1,2,3`
- Date ranges: `?startDate=2024-01-01&endDate=2024-01-31`

**Sorting:**
- `?sort=startTime` (ascending)
- `?sort=-startTime` (descending)
- `?sort=confidence,-createdAt` (multiple fields)

## WebSocket Events (Future)

Real-time updates will be available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.on('odds_update', (data) => {
  // Handle odds updates
});

ws.on('analysis_complete', (data) => {
  // Handle completed analysis
});
```