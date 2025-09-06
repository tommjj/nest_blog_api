import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exceptions.filter';
import { ServiceModule } from 'src/infrastructure/providers/service.module';
import { UserController } from './users.controller';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { AuthController } from './auth.controller';

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
export class HTTPModule {}
