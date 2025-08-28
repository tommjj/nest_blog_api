import { Module } from '@nestjs/common';
import { SqliteModule } from '../db/sqlite.module';
import { UsersRepository } from './users.repository';

@Module({
    imports: [SqliteModule],
    providers: [UsersRepository],
    exports: [],
})
export class RepositoryModule {}
