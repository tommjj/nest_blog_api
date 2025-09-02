import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { IUsersRepository } from '../../core/port/users.port';
import { IPasswordPort, ITokenPort } from '../../core/port/auth.port';
import AuthService from '../../core/services/auth.service';

import { RepositoryModule } from '../repository/repository.module';
import { UsersRepository } from '../repository/users.repository';
import { AuthModule } from '../auth/auth.module';
import { AUTH_SERVICE } from './auth.provider';
import { JWTTokenAdapter } from '../auth/jwt.adapter';
import { Argon2PasswordAdapter } from '../auth/password.adapter';

describe('AuthService', () => {
    let authService: AuthService;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                RepositoryModule,
                AuthModule,
            ],
            providers: [
                {
                    provide: AUTH_SERVICE,
                    useFactory(
                        userRepo: IUsersRepository,
                        tokenAdapter: ITokenPort,
                        hashAdapter: IPasswordPort,
                    ) {
                        return new AuthService(
                            userRepo,
                            tokenAdapter,
                            hashAdapter,
                        );
                    },
                    inject: [
                        UsersRepository,
                        JWTTokenAdapter,
                        Argon2PasswordAdapter,
                    ],
                },
            ],
        }).compile();

        authService = moduleRef.get<AuthService>(AUTH_SERVICE);
    });

    it('should define', () => {
        expect(authService).toBeDefined();
    });
});
