import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { AuthModule } from '../auth/auth.module';
import { AUTH_SERVICE, authProvider } from './auth.provider';

@Module({
    imports: [RepositoryModule, AuthModule],
    providers: [authProvider],
    exports: [AUTH_SERVICE],
})
export class AuthServiceModule {}
