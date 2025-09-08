import type { BlogsSchema } from '../../db/schema.type';
import type { Blog } from 'src/core/domain/blogs';

/**
 * toBlog dto convert PostsSchema to Blog
 * NOTE: this function is not validate input data
 */
function toBlog(blog: BlogsSchema): Blog {
    return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        authorId: blog.authorId,

        updatedAt: new Date(blog.updatedAt),
        createdAt: new Date(blog.createdAt),
    };
}

export const blogDto = {
    toBlog,
};
