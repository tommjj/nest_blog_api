import { Blog } from 'src/core/domain/blogs';
import { HTTPResponse, newSuccessResponse } from './response';

export type BlogResponse = {
    id: number;
    title: string;
    content: string;
    author_id: number;

    last_updated: string;
    created_at: string;
};

export function newBlogResponse(blog: Blog): HTTPResponse<BlogResponse> {
    return newSuccessResponse({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        author_id: blog.authorId,

        last_updated: blog.updatedAt.toISOString(),
        created_at: blog.createdAt.toISOString(),
    });
}
