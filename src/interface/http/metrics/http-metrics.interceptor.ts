import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Request, Response } from 'express';

import { HttpMetricsAdapter } from 'src/interface/http/metrics/http_metrics.adapter';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
    constructor(private readonly metrics: HttpMetricsAdapter) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = process.hrtime();
        return next.handle().pipe(tap(() => this.handle(context, start)));
    }

    private handle(context: ExecutionContext, start: [number, number]) {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const route: string = req.route?.path ?? req.url;

        if (route === '/metrics') {
            return;
        }

        const { method } = req;
        const { statusCode } = res;
        const diff = process.hrtime(start);
        const durationSec = diff[0] + diff[1] / 1e9;

        this.metrics.incRequest(method, route, statusCode);
        this.metrics.observeRequest(method, route, statusCode, durationSec);
    }
}
