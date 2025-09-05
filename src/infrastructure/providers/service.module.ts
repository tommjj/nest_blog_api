import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { AuthModule } from '../auth/auth.module';
import { AUTH_SERVICE, authProvider } from './auth.provider';
import { usersProvider, USERS_SERVICE } from './users.provider';

@Module({
    imports: [RepositoryModule, AuthModule],
    providers: [authProvider, usersProvider],
    exports: [AUTH_SERVICE, USERS_SERVICE],
})
export class AuthServiceModule {}
