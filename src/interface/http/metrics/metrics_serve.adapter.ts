import { Injectable } from '@nestjs/common';

import { register, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class PrometheusMetricsAdapter {
    constructor() {
        collectDefaultMetrics();
    }

    metrics(): Promise<string> {
        return register.metrics();
    }

    contentType(): string {
        return register.contentType;
    }
}
