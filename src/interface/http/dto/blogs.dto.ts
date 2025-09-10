import { Blog } from 'src/core/domain/blogs';
import { HTTPResponse, newPagination, newSuccessResponse } from './response';
import { BlogsSearchResult } from 'src/core/port/blogs.port';

export type BlogResponse = {
    id: number;
    title: string;
    content: string;
    author_id: number;

    last_updated: string;
    created_at: string;
};

export type BlogInfoResponse = Omit<BlogResponse, 'content'>;

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

export function newSearchBlogResponse(
    result: BlogsSearchResult,
): HTTPResponse<BlogInfoResponse[]> {
    const pagination = newPagination(
        result.total,
        result.hits.length,
        result.limit,
        result.offset / result.limit + 1,
    );

    return newSuccessResponse<BlogInfoResponse[]>(
        result.hits.map((blog) => ({
            id: blog.id,
            title: blog.title,
            author_id: blog.authorId,

            last_updated: blog.updatedAt.toISOString(),
            created_at: blog.createdAt.toISOString(),
        })),
        undefined,
        pagination,
    );
}
