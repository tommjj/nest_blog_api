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
        const start = Date.now();

        res.on('finish', () => {
            const { method, originalUrl, ip, headers } = req;
            const { statusCode } = res;
            const duration = Date.now() - start;

            const message = `${method} ${originalUrl} ${statusCode} (${duration}ms)`;

            const metadata = {
                ip,
                userAgent: headers['user-agent'],
                contentLength: headers['content-length'],
                statusCode,
                duration,
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
