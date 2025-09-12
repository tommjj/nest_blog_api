import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { AuthModule } from '../auth/auth.module';
import {
    AUTH_SERVICE,
    TOKEN_VERIFY_SERVICE,
    authProvider,
    tokenVerifyProvider,
} from './auth.provider';
import { usersProvider, USERS_SERVICE } from './users.provider';
import {
    blogsProvider,
    blogsSearchProvider,
    BLOGS_SERVICE,
    BLOGS_SEARCH_SERVICE,
} from './blogs.provider';
import { CacheModule } from '../cache/cache.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [RepositoryModule, AuthModule, CacheModule, LoggerModule],
    providers: [
        authProvider,
        tokenVerifyProvider,
        usersProvider,
        blogsProvider,
        blogsSearchProvider,
    ],
    exports: [
        AUTH_SERVICE,
        TOKEN_VERIFY_SERVICE,
        USERS_SERVICE,
        BLOGS_SERVICE,
        BLOGS_SEARCH_SERVICE,
    ],
})
export class ServiceModule {}
