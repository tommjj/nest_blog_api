import { Blog } from '../domain/blogs';
import {
    CreateBlog,
    IBlogsRepository,
    IBlogsService,
    UpdateBlog,
} from '../port/blogs.port';
import { IKVCachePort } from '../port/cache.port';
import { ILoggerPort } from '../port/logger.port';
import { CacheHelper, newDefaultCacheErrorHandler } from '../utils/cache';
import { parser } from './dto/blogs.dto';

const BLOG_CACHE_PREFIX = 'blogs:';
const BLOG_CACHE_TTL = 3600;

export default class BlogsService implements IBlogsService {
    private cache: CacheHelper<Blog>;
    constructor(
        private blogsRepository: IBlogsRepository,
        cache: IKVCachePort,
        private log: ILoggerPort,
    ) {
        this.cache = new CacheHelper(
            cache,
            parser.toBlog,
            BLOG_CACHE_PREFIX,
            BLOG_CACHE_TTL,
            newDefaultCacheErrorHandler(BLOG_CACHE_PREFIX, log),
        );
    }

    async createBlog(blog: CreateBlog): Promise<Blog> {
        const result = await this.blogsRepository.createBlog(blog);

        await this.cache.set(result.id, result);
        return result;
    }

    async getBlogByID(id: number): Promise<Blog> {
        const cacheResult = await this.cache.get(id);
        if (cacheResult) {
            return cacheResult;
        }

        const result = await this.blogsRepository.getBlogByID(id);
        await this.cache.set(result.id, result);
        return result;
    }

    async updateBlog(blog: UpdateBlog): Promise<Blog> {
        const result = await this.blogsRepository.updateBlog(blog);
        await this.cache.set(result.id, result);
        return result;
    }

    async deleteBlog(id: number): Promise<void> {
        await this.blogsRepository.deleteBlog(id);
        await this.cache.del(id);
    }
}
