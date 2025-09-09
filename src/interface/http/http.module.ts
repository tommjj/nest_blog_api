import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ServiceModule } from 'src/infrastructure/providers/service.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { AuthzModule } from 'src/infrastructure/providers/authz.module';

import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { AuthController } from './auth.controller';
import { ParseToken } from './middleware/parse_token.middleware';

import { UserController } from './users.controller';
import { BlogsController } from './blogs.controller';

@Module({
    imports: [ServiceModule, AuthzModule, LoggerModule],
    controllers: [UserController, AuthController, BlogsController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class HTTPModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ParseToken).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
