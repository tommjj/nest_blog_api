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
