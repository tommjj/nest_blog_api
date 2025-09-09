import { Blog } from '../domain/blogs';
import {
    CreateBlog,
    IBlogsRepository,
    IBlogsService,
    UpdateBlog,
} from '../port/blogs.port';

export default class BlogsService implements IBlogsService {
    constructor(private blogsRepository: IBlogsRepository) {}

    createBlog(blog: CreateBlog): Promise<Blog> {
        return this.blogsRepository.createBlog(blog);
    }

    getBlogByID(id: number): Promise<Blog> {
        return this.blogsRepository.getBlogByID(id);
    }

    updateBlog(blog: UpdateBlog): Promise<Blog> {
        return this.blogsRepository.updateBlog(blog);
    }

    deleteBlog(id: number): Promise<void> {
        return this.blogsRepository.deleteBlog(id);
    }
}
