import { Controller, Get, Res } from '@nestjs/common';

import type { Response } from 'express';

import { PrometheusMetricsAdapter } from 'src/interface/http/metrics/metrics_serve.adapter';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly metrics: PrometheusMetricsAdapter) {}

    @Get()
    async getMetrics(@Res() res: Response) {
        res.setHeader('Content-Type', this.metrics.contentType());
        res.end(await this.metrics.metrics());
    }
}
