import pino from 'pino';

export const logger = pino({
    name: 'lina',
    transport: {
        target: 'pino-pretty',
    },
});

export type Logger = typeof logger;
