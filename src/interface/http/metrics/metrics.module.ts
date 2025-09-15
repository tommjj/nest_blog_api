import { Module } from '@nestjs/common';

import { PrometheusMetricsAdapter } from './metrics_serve.adapter';
import { HttpMetricsAdapter } from './http_metrics.adapter';

@Module({
    providers: [PrometheusMetricsAdapter, HttpMetricsAdapter],
    exports: [PrometheusMetricsAdapter, HttpMetricsAdapter],
})
export class MetricsModule {}
