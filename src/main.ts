import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MetricsServeModule } from './interface/http/metrics/metrics.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const metrics = await NestFactory.create(MetricsServeModule);

    await metrics.listen(process.env.METRICS_PORT ?? 3001, '0.0.0.0');

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
