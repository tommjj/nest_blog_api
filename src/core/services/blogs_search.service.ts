import {
    BlogsSearchResult,
    IBlogsSearchPort,
    IBlogsSearchService,
} from '../port/blogs.port';
import { IKVCachePort } from '../port/cache.port';
import { ILoggerPort } from '../port/logger.port';
import { CacheHelper, newDefaultCacheErrorHandler } from '../utils/cache';

import { parser } from './dto/search.dto';

const BLOG_SEARCH_CACHE_PREFIX = 'search:blogs:';
const BLOG_SEARCH_CACHE_TTL = 60;

export default class BlogsSearchService implements IBlogsSearchService {
    private cache: CacheHelper<BlogsSearchResult>;
    constructor(
        private blogsSearchPort: IBlogsSearchPort,
        cache: IKVCachePort,
        private log: ILoggerPort,
    ) {
        this.cache = new CacheHelper(
            cache,
            parser.toBlogsSearchResult,
            BLOG_SEARCH_CACHE_PREFIX,
            BLOG_SEARCH_CACHE_TTL,
            newDefaultCacheErrorHandler(BLOG_SEARCH_CACHE_PREFIX, log),
        );
    }

    async searchBlogs(
        keyword: string,
        limit?: number,
        offset?: number,
    ): Promise<BlogsSearchResult> {
        const cacheResult = await this.cache.get(
            `q:${keyword}:${limit}:${offset}`,
        );
        if (cacheResult) {
            return cacheResult;
        }

        const result = await this.blogsSearchPort.searchBlogs(
            keyword,
            limit,
            offset,
        );
        await this.cache.set(`q:${keyword}:${limit}:${offset}`, result);

        return result;
    }

    async findBlogsByAuthor(
        authorId: number,
        limit?: number,
        offset?: number,
    ): Promise<BlogsSearchResult> {
        const cacheResult = await this.cache.get(
            `a:${authorId}:${limit}:${offset}`,
        );
        if (cacheResult) {
            return cacheResult;
        }

        const result = await this.blogsSearchPort.findBlogsByAuthor(
            authorId,
            limit,
            offset,
        );
        await this.cache.set(`a:${authorId}:${limit}:${offset}`, result);

        return result;
    }

    countBlogsByAuthor(authorId: number): Promise<number> {
        return this.blogsSearchPort.countBlogsByAuthor(authorId);
    }

    countBlogs(keyword?: string): Promise<number> {
        return this.blogsSearchPort.countBlogs(keyword);
    }
}
