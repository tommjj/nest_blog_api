import { errors } from '../domain/errors';
import {
    IBlogsRepository,
    IBlogOwnershipCheckerService,
} from '../port/blogs.port';

export default class BlogOwnershipCheckerService
    implements IBlogOwnershipCheckerService
{
    constructor(private blogsRepository: IBlogsRepository) {}

    async check(userId: number, blogId: number): Promise<void> {
        const blog = await this.blogsRepository.getBlogByID(blogId);

        if (blog.authorId !== userId) {
            errors.Forbidden(
                `user with id ${userId} does not have ownership of blogId with id ${blogId}`,
            );
        }
    }
}
