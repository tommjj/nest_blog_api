import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './infrastructure/logger/logger.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        LoggerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
