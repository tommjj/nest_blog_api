import { Provider } from '@nestjs/common';

import { IUsersRepository } from '../../core/port/users.port';
import { IPasswordPort } from '../../core/port/auth.port';

import { UsersRepository } from '../repository/users.repository';
import { Argon2PasswordAdapter } from '../auth/password.adapter';
import UserService from '../../core/services/users.service';

export const USERS_SERVICE = Symbol('USERS_SERVICE');
export const usersProvider: Provider = {
    provide: USERS_SERVICE,
    useFactory(userRepo: IUsersRepository, hashAdapter: IPasswordPort) {
        return new UserService(userRepo, hashAdapter);
    },
    inject: [UsersRepository, Argon2PasswordAdapter],
};
