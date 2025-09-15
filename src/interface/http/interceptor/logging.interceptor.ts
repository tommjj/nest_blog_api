import {
    Inject,
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Request, Response } from 'express';

import type { ILoggerPort } from 'src/core/port/logger.port';

import { HTTP_LOGGER_PORT } from 'src/infrastructure/logger/logger.module';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        @Inject(HTTP_LOGGER_PORT)
        private logger: ILoggerPort,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = process.hrtime();

        return next.handle().pipe(tap(() => this.handleLog(context, start)));
    }

    private handleLog(context: ExecutionContext, start: [number, number]) {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

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
    }
}
