import { withError } from 'src/common/helper/withError';
import { User } from '../domain/users';
import { IPasswordPort } from '../port/auth.port';
import {
    CreateUser,
    IUsersRepository,
    IUsersService,
    UpdateUserPassword,
    UpdateUserWithoutPassword,
} from '../port/users.port';
import { DomainError, errors, ErrorType } from '../domain/errors';
import { userDto } from './dto/users.dto';

export default class UserService implements IUsersService {
    constructor(
        private userRepo: IUsersRepository,
        private hash: IPasswordPort,
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

        return userDto.toUserWithOutPassword(createResult.data);
    }

    async getUserProfile(id: number): Promise<User> {
        const user = await this.userRepo.getUserById(id);

        return userDto.toUserWithOutPassword(user);
    }

    async updateUserProfile(user: UpdateUserWithoutPassword): Promise<User> {
        const updatedUser = await this.userRepo.updateUser({
            id: user.id,
            email: user.email,
            name: user.name,
        });

        return userDto.toUserWithOutPassword(updatedUser);
    }

    async updateUserPassword(user: UpdateUserPassword): Promise<void> {
        const hashed = await this.hash.hash(user.password);

        await this.userRepo.updateUser({
            id: user.id,
            password: hashed,
        });
    }

    async deleteUserAccount(id: number): Promise<void> {
        return await this.userRepo.deleteUser(id);
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
