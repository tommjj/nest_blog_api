import { Injectable } from '@nestjs/common';

import { Counter, Histogram } from 'prom-client';

@Injectable()
export class HttpMetricsAdapter {
    private readonly httpRequestsTotal: Counter<string>;
    private readonly httpRequestDuration: Histogram<string>;

    constructor() {
        this.httpRequestsTotal = new Counter({
            name: 'http_requests_total',
            help: 'total HTTP requests',
            labelNames: ['method', 'route', 'status'],
        });

        this.httpRequestDuration = new Histogram({
            name: 'http_request_duration_seconds',
            help: 'duration HTTP request',
            labelNames: ['method', 'route', 'status'],
            buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
        });
    }

    incRequest(method: string, route: string, status: number) {
        this.httpRequestsTotal.inc({ method, route, status: String(status) });
    }

    observeRequest(
        method: string,
        route: string,
        status: number,
        durationMs: number,
    ) {
        return this.httpRequestDuration.observe(
            {
                method,
                route,
                status: String(status),
            },
            durationMs,
        );
    }
}
