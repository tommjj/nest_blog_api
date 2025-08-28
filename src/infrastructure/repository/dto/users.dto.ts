import type { UsersSchema } from '../../db/schema.type';
import type { UserWithPassword } from 'src/core/domain/users';

/**
 * toUser dto convert UsersSchema to UserWithPassword
 * NOTE: this function is not validate input data
 */
function toUser(user: UsersSchema): UserWithPassword {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,

        updatedAt: new Date(user.updatedAt),
        createdAt: new Date(user.createdAt),
    };
}

export const userDto = {
    toUser,
};
