import { Inject, Injectable } from '@nestjs/common';
import type { ILoggerPort } from './core/port/logger';
import { LOGGER_PORT } from './infrastructure/logger/logger.module';

@Injectable()
export class AppService {
    constructor(@Inject(LOGGER_PORT) private logx: ILoggerPort) {}

    ping() {
        this.logx.info('Pinged the service', {
            timestamp: new Date().toISOString(),
        });
        return {
            status: 'ok',
            message: 'pong',
            timestamp: new Date().toISOString(),
        };
    }
}
