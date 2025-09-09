/* eslint-disable @typescript-eslint/require-await */

import { TokenPayload } from '../domain/auth';
import { errors } from '../domain/errors';
import { IBlogOwnershipCheckerService, IBlogsAuthz } from '../port/blogs.port';

export class BlogsAuthz implements IBlogsAuthz {
    constructor(private checker: IBlogOwnershipCheckerService) {}

    async canCreateBlog(token: TokenPayload | undefined): Promise<void> {
        if (!token) {
            errors.throw.Unauthorized();
        }
    }

    async canGetBlog(): Promise<void> {
        return;
    }

    async canUpdateBlog(
        token: TokenPayload | undefined,
        blogId: number,
    ): Promise<void> {
        if (!token) {
            throw errors.Unauthorized();
        }

        await this.checker.check(token.id, blogId);
    }

    async canDeleteBlog(
        token: TokenPayload | undefined,
        blogId: number,
    ): Promise<void> {
        if (!token) {
            throw errors.Unauthorized();
        }

        await this.checker.check(token.id, blogId);
    }

    async canSearchBlogs(): Promise<void> {
        return;
    }
}
