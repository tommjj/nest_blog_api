import { Provider } from '@nestjs/common';

import { IUsersRepository } from 'src/core/port/users.port';
import { IPasswordPort } from 'src/core/port/auth.port';
import { UserAuthz } from 'src/core/authz/user.authz';
import { IKVCachePort } from 'src/core/port/cache.port';
import UserService from 'src/core/services/users.service';
import { ILoggerPort } from 'src/core/port/logger.port';

import { UsersRepository } from '../repository/users.repository';
import { Argon2PasswordAdapter } from '../auth/password.adapter';
import { NodeCacheAdapter } from '../cache/node_cache.adapter';
import { LOGGER_PORT } from '../logger/logger.module';

export const USERS_SERVICE = Symbol('USERS_SERVICE');
export const usersProvider: Provider = {
    provide: USERS_SERVICE,
    useFactory(
        userRepo: IUsersRepository,
        hashAdapter: IPasswordPort,
        cache: IKVCachePort,
        log: ILoggerPort,
    ) {
        return new UserService(userRepo, hashAdapter, cache, log);
    },
    inject: [
        UsersRepository,
        Argon2PasswordAdapter,
        NodeCacheAdapter,
        LOGGER_PORT,
    ],
};

export const USERS_AUTHZ = Symbol('USERS_AUTHZ');
export const usersAuthzProvider: Provider = {
    provide: USERS_AUTHZ,
    useFactory() {
        return new UserAuthz();
    },
};
