import { Test, TestingModule } from '@nestjs/testing';

import { IUsersRepository } from '../../core/port/users.port';
import { IPasswordPort, ITokenPort } from '../../core/port/auth.port';
import { RepositoryModule } from '../repository/repository.module';
import { AuthModule, JWT_PORT, PASSWORD_PORT } from '../auth/auth.module';
import AuthService from '../../core/services/auth.service';
import { AUTH_SERVICE } from './auth.provider';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from '../repository/users.repository';

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
                    inject: [UsersRepository, JWT_PORT, PASSWORD_PORT],
                },
            ],
        }).compile();

        authService = moduleRef.get<AuthService>(AUTH_SERVICE);
    });

    it('should define', () => {
        expect(authService).toBeDefined();
    });
});
