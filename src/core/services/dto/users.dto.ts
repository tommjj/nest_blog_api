import { User, UserWithPassword } from 'src/core/domain/users';

function toUserWithOutPassword(user: UserWithPassword): User {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
    };
}

export const userDto = {
    toUserWithOutPassword,
};
