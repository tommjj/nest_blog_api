import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { AuthModule, JWT_PORT, PASSWORD_PORT } from '../auth/auth.module';
import AuthService from '../../core/services/auth.service';
import { IUsersRepository } from '../../core/port/users.port';
import { IPasswordPort, ITokenPort } from '../../core/port/auth.port';
import { UsersRepository } from '../repository/users.repository';

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

@Module({
    imports: [RepositoryModule, AuthModule],
    providers: [
        {
            provide: AUTH_SERVICE,
            useFactory(
                userRepo: IUsersRepository,
                tokenAdapter: ITokenPort,
                hashAdapter: IPasswordPort,
            ) {
                return new AuthService(userRepo, tokenAdapter, hashAdapter);
            },
            inject: [UsersRepository, JWT_PORT, PASSWORD_PORT],
        },
    ],
    exports: [AUTH_SERVICE],
})
export class AuthServiceModule {}
