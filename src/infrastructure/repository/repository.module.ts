import { Module } from '@nestjs/common';
import { SqliteModule } from '../db/sqlite.module';
import { UsersRepository } from './users.repository';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

@Module({
    imports: [SqliteModule],
    providers: [UsersRepository],
    exports: [UsersRepository],
})
export class RepositoryModule {}
