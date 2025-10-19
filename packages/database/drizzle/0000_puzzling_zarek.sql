CREATE TABLE `odds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`market` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`point` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `odds_event_id_market_name_point_unique` ON `odds` (`event_id`,`market`,`name`,`point`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`home_team` text NOT NULL,
	`away_team` text NOT NULL,
	`start_time` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_event_id_unique` ON `events` (`event_id`);--> statement-breakpoint
CREATE TABLE `games` (
	`id` integer PRIMARY KEY NOT NULL,
	`home_team` text NOT NULL,
	`away_team` text NOT NULL,
	`game_date` integer NOT NULL,
	`week` integer,
	`season` integer NOT NULL,
	`status` text NOT NULL,
	`home_score` integer,
	`away_score` integer,
	`venue` text,
	`weather_conditions` text,
	`surface_type` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_injuries` (
	`id` integer PRIMARY KEY NOT NULL,
	`player_name` text NOT NULL,
	`team` text NOT NULL,
	`position` text,
	`injury_status` text NOT NULL,
	`body_part` text,
	`description` text,
	`game_id` integer,
	`reported_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`abbreviation` text NOT NULL,
	`conference` text,
	`division` text,
	`primary_color` text,
	`secondary_color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_name_unique` ON `teams` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_abbreviation_unique` ON `teams` (`abbreviation`);