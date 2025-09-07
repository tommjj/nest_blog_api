import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { ServiceModule } from 'src/infrastructure/providers/service.module';
import { UserController } from './users.controller';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { AuthController } from './auth.controller';
import { MustParseToken } from './middleware/parse_token.middleware';

@Module({
    imports: [ServiceModule, LoggerModule],
    controllers: [UserController, AuthController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class HTTPModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(MustParseToken).forRoutes({
            path: 'users/:id',
            method: RequestMethod.PATCH,
        });
    }
}
