import { join } from 'path';
import { Injectable } from '@nestjs/common';
import pino from 'pino';
import { ILoggerPort } from 'src/core/port/logger';

function newLogger(level: string = 'info'): pino.Logger {
    return pino({
        level: level,
        transport: {
            targets: [
                {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'SYS:standard',
                        colorize: true,
                    },
                    level: 'debug',
                },
                {
                    target: 'pino-roll',
                    options: {
                        file: join('logs', 'app'),
                        frequency: 'daily',
                        mkdir: true,
                        colorize: true,
                        dateFormat: 'yyyy-MM-dd',
                        extension: '.log',
                        size: '20m',
                        maxFiles: 10,
                    },
                    level: 'info',
                },
            ],
        },
    });
}

@Injectable()
class LoggerAdapter implements ILoggerPort {
    private readonly logger: pino.Logger;

    constructor() {
        this.logger = newLogger(process.env.LOG_LEVEL);
    }

    debug(message: string, metadata?: Record<string, any>): void {
        this.logger.debug(metadata, message);
    }
    info(message: string, metadata?: Record<string, any>): void {
        this.logger.info(metadata, message);
    }
    warn(message: string, metadata?: Record<string, any>): void {
        this.logger.warn(metadata, message);
    }
    error(message: string, metadata?: Record<string, any>): void {
        this.logger.error(metadata, message);
    }
    fatal(message: string, metadata?: Record<string, any>): void {
        this.logger.fatal(metadata, message);
    }
}

export { LoggerAdapter };
