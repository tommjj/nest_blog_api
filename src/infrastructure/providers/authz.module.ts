import { Module } from '@nestjs/common';

import { RepositoryModule } from '../repository/repository.module';

import { usersAuthzProvider, USERS_AUTHZ } from './users.provider';
import { blogsAuthzProvider, BLOGS_AUTHZ } from './blogs.provider';

@Module({
    imports: [RepositoryModule],
    providers: [usersAuthzProvider, blogsAuthzProvider],
    exports: [USERS_AUTHZ, BLOGS_AUTHZ],
})
export class AuthzModule {}
