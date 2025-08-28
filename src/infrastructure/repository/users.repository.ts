import { Injectable, Inject } from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { UserWithPassword } from '../../core/domain/users';
import { errors } from '../../core/domain/errors';
import { withError } from '../../common/helper/withError';
import type {
    CreateUser,
    IUsersRepository,
    UpdateUser,
} from '../../core/port/users.port';

import * as schema from '../db/schema';
import { DB_PROVIDER_NAME } from '../db/sqlite.module';
import type { SQLiteDB } from '../db/sqlite.module';
import {
    handleDeleteError,
    handleFindError,
    handleInsertError,
    handleUpdateError,
} from './helper';

import { userDto } from './dto/users.dto';

/**
 * UsersRepository implements IUsersRepository
 */
@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@Inject(DB_PROVIDER_NAME) private db: SQLiteDB) {}

    async createUser(user: CreateUser): Promise<UserWithPassword> {
        const createdUser = await withError(
            this.db
                .insert(schema.users)
                .values({
                    email: user.email,
                    name: user.name,
                    password: user.password,
                })
                .returning(),
        );
        if (!createdUser.ok) {
            handleInsertError(createdUser.error);
        }

        return userDto.toUser(createdUser.data[0]);
    }

    async getUserById(id: number): Promise<UserWithPassword> {
        const result = await withError(
            this.db.select().from(schema.users).where(eq(schema.users.id, id)),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }
        if (result.data.length === 0) {
            errors.NotFound('user not found');
        }

        return userDto.toUser(result.data[0]);
    }

    async getUserByEmail(email: string): Promise<UserWithPassword> {
        const result = await withError(
            this.db
                .select()
                .from(schema.users)
                .where(eq(schema.users.email, email)),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }
        if (result.data.length === 0) {
            errors.NotFound('user not found');
        }

        return userDto.toUser(result.data[0]);
    }

    async updateUser(user: UpdateUser): Promise<UserWithPassword> {
        const result = await withError(
            this.db
                .update(schema.users)
                .set({
                    email: user.email,
                    name: user.name,
                    password: user.password,
                })
                .where(eq(schema.users.id, user.id))
                .returning(),
        );
        if (!result.ok) {
            handleUpdateError(result.error);
        }
        if (result.data.length === 0) {
            throw errors.NotFound(`user with id ${user.id} not found`);
        }

        return userDto.toUser(result.data[0]);
    }

    async deleteUser(id: number): Promise<void> {
        const result = await withError(
            this.db.delete(schema.users).where(eq(schema.users.id, id)),
        );
        if (!result.ok) {
            handleDeleteError(result.error);
        }
        if (result.data.rowsAffected === 0) {
            throw errors.NotFound(`user with id ${id} not found`, {
                service: 'UserService_deleteUser',
            });
        }
    }
}
