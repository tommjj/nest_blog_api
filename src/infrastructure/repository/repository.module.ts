import { Module } from '@nestjs/common';
import { SqliteModule } from '../db/sqlite.module';
import { UsersRepository } from './users.repository';
import { BlogsRepository } from './blogs.repository';
import { BlogsSearchRepository } from './blog_search.repository';

@Module({
    imports: [SqliteModule],
    providers: [UsersRepository, BlogsRepository, BlogsSearchRepository],
    exports: [UsersRepository, BlogsRepository, BlogsSearchRepository],
})
export class RepositoryModule {}
