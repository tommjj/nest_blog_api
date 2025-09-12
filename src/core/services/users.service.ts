import { withError } from 'src/common/helper/withError';
import { User } from '../domain/users';
import { IPasswordPort } from '../port/auth.port';
import { IKVCachePort } from '../port/cache.port';
import {
    CreateUser,
    IUsersRepository,
    IUsersService,
    UpdateUserPassword,
    UpdateUserWithoutPassword,
} from '../port/users.port';
import { DomainError, errors, ErrorType } from '../domain/errors';
import { converter, parser } from './dto/users.dto';
import { ILoggerPort } from '../port/logger.port';
import { cacheGet } from '../utils/cache';

const USER_CACHE_PREFIX = 'users:';
const USER_CACHE_TTL = 3600;

export default class UserService implements IUsersService {
    constructor(
        private userRepo: IUsersRepository,
        private hash: IPasswordPort,
        private cache: IKVCachePort,
        private log: ILoggerPort,
    ) {}

    async registerUser(user: CreateUser): Promise<User> {
        user.password = await this.hash.hash(user.password);

        const createResult = await withError(
            this.userRepo.createUser({
                email: user.email,
                name: user.name,
                password: user.password,
            }),
        );
        if (!createResult.ok) {
            this.handleCreateUserError(createResult.error);
        }

        const returning = converter.toUserWithOutPassword(createResult.data);
        await this.setCacheUser(returning);

        return returning;
    }

    async getUserProfile(id: number): Promise<User> {
        const cacheResult = await this.getCache(id);
        if (cacheResult) {
            return cacheResult;
        }

        const user = await this.userRepo.getUserById(id);

        const returning = converter.toUserWithOutPassword(user);
        await this.setCacheUser(returning);

        return returning;
    }

    async updateUserProfile(user: UpdateUserWithoutPassword): Promise<User> {
        const updatedUser = await this.userRepo.updateUser({
            id: user.id,
            email: user.email,
            name: user.name,
        });

        const returning = converter.toUserWithOutPassword(updatedUser);
        await this.setCacheUser(returning);

        return returning;
    }

    async updateUserPassword(user: UpdateUserPassword): Promise<void> {
        const hashed = await this.hash.hash(user.password);

        await this.userRepo.updateUser({
            id: user.id,
            password: hashed,
        });
    }

    async deleteUserAccount(id: number): Promise<void> {
        await this.userRepo.deleteUser(id);

        await this.cacheDel(id);
    }

    private handleCreateUserError(error: unknown): never {
        if (!(error instanceof DomainError)) {
            throw errors.Internal('internal', undefined, error);
        }

        if (error.is(ErrorType.ErrDataConflicting)) {
            throw errors.New(ErrorType.ErrInvalidData, 'user already exists');
        }
        throw error;
    }

    private async setCacheUser(user: User) {
        try {
            await this.cache.set(
                `${USER_CACHE_PREFIX}${user.id}`,
                user,
                USER_CACHE_TTL,
            );
        } catch (error: any) {
            this.log.error(`set cache error with user id ${user.id}: ${error}`);
        }
    }

    private async getCache(id: number): Promise<User | undefined> {
        const result = await cacheGet(
            this.cache.get(`${USER_CACHE_PREFIX}${id}`),
            parser.toUser,
        );
        if (result.ok) {
            return result.v;
        }

        // handle error
        const err = result.err;
        if (err instanceof DomainError) {
            if (err.is(ErrorType.ErrNotFound)) {
                return;
            }
            this.log.error(`${err.type}: ${err.privateMessage}`);
        } else {
            this.log.error(`internal error: ${err as any}`);
        }
    }

    private async cacheDel(id: number) {
        try {
            await this.cache.del(`${USER_CACHE_PREFIX}${id}`);
        } catch (err: any) {
            if (err instanceof DomainError) {
                this.log.error(`${err.type}: ${err.privateMessage}`);
            }

            this.log.error(`internal error: ${err}`);
        }
    }
}
