import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { config } from '../utils/get_config.helper';
import { LoggerAdapter } from './logger.adapter';

export const LOGGER_PORT = Symbol('LOGGER_PORT');
export const HTTP_LOGGER_PORT = Symbol('HTTP_LOGGER_PORT');

@Module({
    providers: [
        {
            provide: LOGGER_PORT,
            useFactory(conf: ConfigService) {
                const level = config(conf).mustString('LOG_LEVEL');

                return new LoggerAdapter('app', level);
            },
            inject: [ConfigService],
        },
        {
            provide: HTTP_LOGGER_PORT,
            useFactory(conf: ConfigService) {
                const level = config(conf).mustString('LOG_LEVEL');

                return new LoggerAdapter('http', level);
            },

            inject: [ConfigService],
        },
    ],
    exports: [LOGGER_PORT, HTTP_LOGGER_PORT],
})
export class LoggerModule {}
