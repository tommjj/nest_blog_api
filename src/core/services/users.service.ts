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
import { CacheHelper, newDefaultCacheErrorHandler } from '../utils/cache';

const USER_CACHE_PREFIX = 'users:';
const USER_CACHE_TTL = 3600;

export default class UserService implements IUsersService {
    private cache: CacheHelper<User>;
    constructor(
        private userRepo: IUsersRepository,
        private hash: IPasswordPort,
        cache: IKVCachePort,
        private log: ILoggerPort,
    ) {
        this.cache = new CacheHelper(
            cache,
            parser.toUser,
            USER_CACHE_PREFIX,
            USER_CACHE_TTL,
            newDefaultCacheErrorHandler(USER_CACHE_PREFIX, log),
        );
    }

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
        await this.cache.set(returning.id, returning);

        return returning;
    }

    async getUserProfile(id: number): Promise<User> {
        const cacheResult = await this.cache.get(id);
        if (cacheResult) {
            return cacheResult;
        }

        const user = await this.userRepo.getUserById(id);

        const returning = converter.toUserWithOutPassword(user);
        await this.cache.set(returning.id, returning);

        return returning;
    }

    async updateUserProfile(user: UpdateUserWithoutPassword): Promise<User> {
        const updatedUser = await this.userRepo.updateUser({
            id: user.id,
            email: user.email,
            name: user.name,
        });

        const returning = converter.toUserWithOutPassword(updatedUser);
        await this.cache.set(returning.id, returning);

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

        await this.cache.del(id);
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
}
