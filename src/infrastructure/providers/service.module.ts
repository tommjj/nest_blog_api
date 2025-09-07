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

@Module({
    imports: [RepositoryModule, AuthModule],
    providers: [authProvider, tokenVerifyProvider, usersProvider],
    exports: [AUTH_SERVICE, TOKEN_VERIFY_SERVICE, USERS_SERVICE],
})
export class ServiceModule {}
