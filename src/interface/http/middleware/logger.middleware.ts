import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import type { ILoggerPort } from 'src/core/port/logger.port';
import { HTTP_LOGGER_PORT } from 'src/infrastructure/logger/logger.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        @Inject(HTTP_LOGGER_PORT)
        private logger: ILoggerPort,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const start = process.hrtime();

        res.on('finish', () => {
            const { method, originalUrl, ip, headers } = req;
            const { statusCode } = res;
            const diff = process.hrtime(start);
            const durationMs = diff[0] * 1e3 + diff[1] / 1e6;

            const message = `${method} ${originalUrl} ${statusCode} (${durationMs}ms)`;

            const metadata = {
                ip,
                userAgent: headers['user-agent'],
                contentLength: headers['content-length'],
                statusCode,
                durationMs,
            };

            if (statusCode >= 500) {
                this.logger.error(message, metadata);
            } else if (statusCode >= 400) {
                this.logger.warn(message, metadata);
            } else {
                this.logger.info(message, metadata);
            }
        });

        next();
    }
}
