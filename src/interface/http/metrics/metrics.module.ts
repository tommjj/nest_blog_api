import { Module } from '@nestjs/common';

import { PrometheusMetricsAdapter } from './metrics_serve.adapter';
import { HttpMetricsAdapter } from './http_metrics.adapter';
import { MetricsController } from './metrics.controller';

@Module({
    providers: [HttpMetricsAdapter],
    exports: [HttpMetricsAdapter],
})
export class MetricsModule {}

@Module({
    providers: [PrometheusMetricsAdapter],
    controllers: [MetricsController],
})
export class MetricsServeModule {}
