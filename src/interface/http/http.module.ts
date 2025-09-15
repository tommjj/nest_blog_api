import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { ServiceModule } from 'src/infrastructure/providers/service.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { AuthzModule } from 'src/infrastructure/providers/authz.module';

import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { AuthController } from './auth.controller';
import { ParseTokenMiddleware } from './middleware/parse_token.middleware';

import { UserController } from './users.controller';
import { BlogsController } from './blogs.controller';
import { BlogsSearchController } from './blogs_search.controller';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { MetricsModule } from 'src/interface/http/metrics/metrics.module';
import { HttpMetricsInterceptor } from './metrics/http-metrics.interceptor';
import { MetricsController } from './metrics.controller';

@Module({
    imports: [ServiceModule, AuthzModule, LoggerModule, MetricsModule],
    controllers: [
        UserController,
        AuthController,
        BlogsController,
        BlogsSearchController,
        MetricsController,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
        { provide: APP_INTERCEPTOR, useClass: HttpMetricsInterceptor },
    ],
})
export class HTTPModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ParseTokenMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
