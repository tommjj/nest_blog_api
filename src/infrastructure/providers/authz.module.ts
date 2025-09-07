import { Module } from '@nestjs/common';

import { usersAuthzProvider, USERS_AUTHZ } from './users.provider';

@Module({
    imports: [],
    providers: [usersAuthzProvider],
    exports: [USERS_AUTHZ],
})
export class AuthzModule {}
