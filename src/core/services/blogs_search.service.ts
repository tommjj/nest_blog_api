import {
    BlogsSearchResult,
    IBlogsSearchPort,
    IBlogsSearchService,
} from '../port/blogs.port';

export default class BlogsSearchService implements IBlogsSearchService {
    constructor(private blogsSearchPort: IBlogsSearchPort) {}

    searchBlogs(
        keyword: string,
        limit?: number,
        offset?: number,
    ): Promise<BlogsSearchResult> {
        return this.blogsSearchPort.searchBlogs(keyword, limit, offset);
    }
    findBlogsByAuthor(
        authorId: number,
        limit?: number,
        offset?: number,
    ): Promise<BlogsSearchResult> {
        return this.blogsSearchPort.findBlogsByAuthor(authorId, limit, offset);
    }

    countBlogsByAuthor(authorId: number): Promise<number> {
        return this.blogsSearchPort.countBlogsByAuthor(authorId);
    }

    countBlogs(keyword?: string): Promise<number> {
        return this.blogsSearchPort.countBlogs(keyword);
    }
}
