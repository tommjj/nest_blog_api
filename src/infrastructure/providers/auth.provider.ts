import { Provider } from '@nestjs/common';

import { IUsersRepository } from 'src/core/port/users.port';
import { ITokenPort, IPasswordPort } from 'src/core/port/auth.port';
import AuthService from 'src/core/services/auth.service';
import TokenVerifyService from 'src/core/services/token.service';

import { UsersRepository } from '../repository/users.repository';
import { JWTTokenAdapter } from '../auth/jwt.adapter';
import { Argon2PasswordAdapter } from '../auth/password.adapter';

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
export const authProvider: Provider = {
    provide: AUTH_SERVICE,
    useFactory(
        userRepo: IUsersRepository,
        tokenAdapter: ITokenPort,
        hashAdapter: IPasswordPort,
    ) {
        return new AuthService(userRepo, tokenAdapter, hashAdapter);
    },
    inject: [UsersRepository, JWTTokenAdapter, Argon2PasswordAdapter],
};

export const TOKEN_VERIFY_SERVICE = Symbol('TOKEN_VERIFY_SERVICE');
export const tokenVerifyProvider: Provider = {
    provide: TOKEN_VERIFY_SERVICE,
    useFactory(tokenAdapter: ITokenPort) {
        return new TokenVerifyService(tokenAdapter);
    },
    inject: [JWTTokenAdapter],
};
