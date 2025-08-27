import { Module } from '@nestjs/common';

import { LoggerAdapter } from './logger.adapter';

export const LOGGER_PORT = Symbol('LOGGER_PORT');

@Module({
    providers: [
        {
            provide: LOGGER_PORT,
            useClass: LoggerAdapter,
        },
    ],
    exports: [LOGGER_PORT],
})
export class LoggerModule {}
