import { Provider } from '@nestjs/common';

import { IUsersRepository } from '../../core/port/users.port';
import { ITokenPort, IPasswordPort } from '../../core/port/auth.port';
import AuthService from '../../core/services/auth.service';

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
