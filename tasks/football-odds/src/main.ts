import { logger } from "@lina/logger";
import { OddsAggregator } from "./aggregate-odds";
import { DatabaseClient } from "@lina/database";
import { OddsApiClient } from "@lina/odds-api";
import { config } from "./config";
const main = async () => {
    logger.info("Starting odds aggregation task...");
    const db = DatabaseClient.getInstance();
    const oddsApiClient = new OddsApiClient(config.ODDS_API_KEY);
    const oddsAggregator = new OddsAggregator(logger, db, oddsApiClient);
    await oddsAggregator.aggregate();
};

main()
    .then(() => {
        logger.info("Odds aggregation task completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        logger.error(error, "Error in odds aggregation task");
        process.exit(1);
    });
