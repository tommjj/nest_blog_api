import { Blog } from '../domain/blogs';

export type CreateBlog = Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBlog = Partial<Omit<CreateBlog, 'authorId'>> & { id: number };

/**
 * IBlogRepository
 */
export interface IBlogRepository {
    /**
     * createBlog insert a new blog into database
     *
     * @param blog - create blog data
     * @throws DomainError if blog creation fails
     */
    createBlog(blog: CreateBlog): Promise<Blog>;

    /**
     * getBlogByID get blog by blog id
     *
     * @param id - blog id
     * @throws DomainError if blog not found
     */
    getBlogByID(id: number): Promise<Blog>;

    /**
     * updateBlog update
     *
     * @param blog - update blog
     * @throws DomainError if update fails
     */
    updateBlog(blog: UpdateBlog): Promise<Blog>;

    /**
     * deleteBlog delete blog by id
     *
     * @param id - blog id
     * @throws DomainError if blog deletion fails
     */
    deleteBlog(id: number): Promise<void>;
}

export interface BlogsSearchResult {
    total: number;
    hits: Blog[];
    offset: number;
    limit: number;
}

export interface IBlogsSearchPort {
    /**
     * searchBlogs search blogs by keyword in title or content
     *
     * @param keyword - keyword to search
     * @param limit - max number of results
     * @param offset - pagination offset
     */
    searchBlogs(
        keyword: string,
        limit?: number,
        offset?: number,
    ): Promise<BlogsSearchResult>;

    /**
     * findBlogsByAuthor find blogs by a specific author
     *
     * @param authorId - author id
     * @param limit - max number of results
     * @param offset - pagination offset
     */
    findBlogsByAuthor(
        authorId: number,
        limit?: number,
        offset?: number,
    ): Promise<BlogsSearchResult>;

    /**
     * countBlogs count total blogs matching a keyword
     *
     * @param keyword - keyword to search
     */
    countBlogsByAuthor(authorId: number): Promise<number>;

    /**
     * countBlogs count total blogs matching a keyword
     *
     * @param keyword - keyword to search
     */
    countBlogs(keyword?: string): Promise<number>;
}
