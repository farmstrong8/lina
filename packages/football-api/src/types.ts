/**
 * TypeScript interfaces for American Football API responses
 * Based on API-American-Football specifications
 */

// Common types
export interface Team {
    id: number;
    name: string;
    nickname: string;
    code: string;
    city: string;
    logo: string;
}

export interface Venue {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    capacity: number;
    surface: string;
    image: string;
}

export interface Week {
    current: number;
}

export interface Timezone {
    timezone: string;
}

// Games endpoint types

export interface GameStatus {
    short: string;
    long: string;
    timer?: number;
}

export interface Game {
    id: number;
    date: string;
    time: string;
    timestamp: number;
    timezone: string;
    stage: string;
    week: string;
    status: GameStatus;
    league: {
        id: number;
        name: string;
        season: string;
        logo: string;
        country: {
            name: string;
            code: string;
            flag: string;
        };
    };
    country: {
        name: string;
        code: string;
        flag: string;
    };
    teams: {
        home: Team;
        away: Team;
    };
    scores: {
        home: number;
        away: number;
    };
    venue: Venue;
}

export interface GamesResponse {
    get: string;
    parameters: {
        league?: string;
        season?: string;
        date?: string;
        week?: string;
        team?: string;
        timezone?: string;
    };
    errors: unknown[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: Game[];
}

// Players endpoint types
export interface PlayerPhysical {
    age: number;
    height: string;
    weight: string;
}

export interface PlayerBirth {
    date: string;
    country: string;
}

export interface PlayerCollege {
    name: string;
}

export interface Player {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    number: number;
    position: string;
    status: {
        active: boolean;
        injury: boolean;
        description?: string;
    };
    physical: PlayerPhysical;
    birth: PlayerBirth;
    college: PlayerCollege;
    experience: number;
    photo: string;
}

export interface PlayersResponse {
    get: string;
    parameters: {
        team?: string;
        season?: string;
        search?: string;
        page?: string;
    };
    errors: unknown[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: Player[];
}

// Player statistics endpoint types
export interface PassingStats {
    attempts: number;
    completions: number;
    completion_percentage: number;
    yards: number;
    average: number;
    yards_per_attempt: number;
    touchdowns: number;
    interceptions: number;
    rating: number;
    sacks: number;
    sacks_yards_lost: number;
}

export interface RushingStats {
    attempts: number;
    yards: number;
    average: number;
    longest: number;
    touchdowns: number;
}

export interface ReceivingStats {
    receptions: number;
    targets: number;
    yards: number;
    average: number;
    longest: number;
    touchdowns: number;
}

export interface DefenseStats {
    total_tackles: number;
    solo_tackles: number;
    assists: number;
    sacks: number;
    sacks_yards_lost: number;
    tackles_for_loss: number;
    tackles_for_loss_yards: number;
    quarterback_hits: number;
    interceptions: number;
    interceptions_yards: number;
    forced_fumbles: number;
    fumbles_recovered: number;
    fumbles_yards: number;
    passes_defended: number;
    safeties: number;
}

export interface KickingStats {
    field_goals_made: number;
    field_goals_attempted: number;
    field_goals_percentage: number;
    longest: number;
    extra_points_made: number;
    extra_points_attempted: number;
    extra_points_percentage: number;
}

export interface PuntingStats {
    punts: number;
    yards: number;
    average: number;
    longest: number;
    inside_20: number;
    touchbacks: number;
    fair_catches: number;
    blocked: number;
}

export interface PlayerStatistic {
    player: Player;
    team: Team;
    statistics: {
        games: {
            played: number;
            started: number;
        };
        passing?: PassingStats;
        rushing?: RushingStats;
        receiving?: ReceivingStats;
        defense?: DefenseStats;
        kicking?: KickingStats;
        punting?: PuntingStats;
        returning?: {
            punt_returns: number;
            punt_return_yards: number;
            punt_return_average: number;
            punt_return_longest: number;
            punt_return_touchdowns: number;
            kick_returns: number;
            kick_return_yards: number;
            kick_return_average: number;
            kick_return_longest: number;
            kick_return_touchdowns: number;
        };
    };
}

export interface StatisticsResponse {
    get: string;
    parameters: {
        league?: string;
        season?: string;
        team?: string;
        player?: string;
        game?: string;
    };
    errors: unknown[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: PlayerStatistic[];
}

// Injuries endpoint types
export interface InjuryStatus {
    type: string;
    detail: string;
}

export interface Injury {
    player: Player;
    team: Team;
    status: InjuryStatus;
    games: number;
    date: string;
}

export interface InjuriesResponse {
    get: string;
    parameters: {
        league?: string;
        season?: string;
        team?: string;
        player?: string;
        date?: string;
        timezone?: string;
    };
    errors: unknown[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: Injury[];
}

// Request parameter types
export interface GamesParams {
    league?: string;
    season?: string;
    date?: string;
    week?: string;
    team?: string;
    timezone?: string;
}

export interface PlayersParams {
    team?: string;
    season?: string;
    search?: string;
    page?: string;
}

export interface StatisticsParams {
    league?: string;
    season?: string;
    team?: string;
    player?: string;
    game?: string;
}

export interface InjuriesParams {
    league?: string;
    season?: string;
    team?: string;
    player?: string;
    date?: string;
    timezone?: string;
}
