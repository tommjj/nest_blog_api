import { User, UserWithPassword } from 'src/core/domain/users';
import { ParseResult } from './type';

import z from 'zod/v4';

function toUserWithOutPassword(user: UserWithPassword): User {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
    };
}

export const converter = {
    toUserWithOutPassword,
};

// * parser

const userZodSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
});

function toUser(v: any): ParseResult<User> {
    const parsed = userZodSchema.safeParse(v);
    if (parsed.success) {
        return {
            v: parsed.data,
            ok: true,
        };
    }
    return {
        v: undefined,
        ok: false,
    };
}

export const parser = {
    toUser,
};
