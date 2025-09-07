import { Provider } from '@nestjs/common';

import { IUsersRepository } from '../../core/port/users.port';
import { IPasswordPort } from '../../core/port/auth.port';
import { UserAuthz } from '../../core/authz/user.authz';
import UserService from '../../core/services/users.service';

import { UsersRepository } from '../repository/users.repository';
import { Argon2PasswordAdapter } from '../auth/password.adapter';

export const USERS_SERVICE = Symbol('USERS_SERVICE');
export const usersProvider: Provider = {
    provide: USERS_SERVICE,
    useFactory(userRepo: IUsersRepository, hashAdapter: IPasswordPort) {
        return new UserService(userRepo, hashAdapter);
    },
    inject: [UsersRepository, Argon2PasswordAdapter],
};

export const USERS_AUTHZ = Symbol('USERS_AUTHZ');
export const usersAuthzProvider: Provider = {
    provide: USERS_AUTHZ,
    useFactory() {
        return new UserAuthz();
    },
};
