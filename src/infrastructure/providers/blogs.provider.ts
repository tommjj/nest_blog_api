import { Provider } from '@nestjs/common';

import { ILoggerPort } from 'src/core/port/logger.port';
import { IKVCachePort } from 'src/core/port/cache.port';
import { IBlogsRepository, IBlogsSearchPort } from 'src/core/port/blogs.port';
import BlogsSearchService from 'src/core/services/blogs_search.service';
import BlogsService from 'src/core/services/blogs.service';
import { BlogsAuthz } from 'src/core/authz/blog.authz';

import { BlogsRepository } from '../repository/blogs.repository';
import { BlogsSearchRepository } from '../repository/blogs_search.repository';
import BlogOwnershipCheckerService from 'src/core/services/blog_ornership_checker.service';
import { NodeCacheAdapter } from '../cache/node_cache.adapter';
import { LOGGER_PORT } from '../logger/logger.module';

export const BLOGS_SERVICE = Symbol('BLOGS_SERVICE');
export const blogsProvider: Provider = {
    provide: BLOGS_SERVICE,
    useFactory(
        blogsRepo: IBlogsRepository,
        cache: IKVCachePort,
        log: ILoggerPort,
    ) {
        return new BlogsService(blogsRepo, cache, log);
    },
    inject: [BlogsRepository, NodeCacheAdapter, LOGGER_PORT],
};

export const BLOGS_SEARCH_SERVICE = Symbol('BLOGS_SEARCH_SERVICE');
export const blogsSearchProvider: Provider = {
    provide: BLOGS_SEARCH_SERVICE,
    useFactory(
        blogsSearchPort: IBlogsSearchPort,
        cache: IKVCachePort,
        log: ILoggerPort,
    ) {
        return new BlogsSearchService(blogsSearchPort, cache, log);
    },
    inject: [BlogsSearchRepository, NodeCacheAdapter, LOGGER_PORT],
};

export const BLOGS_AUTHZ = Symbol('BLOGS_AUTHZ');
export const blogsAuthzProvider: Provider = {
    provide: BLOGS_AUTHZ,
    useFactory(blogsRepo: IBlogsRepository) {
        const checker = new BlogOwnershipCheckerService(blogsRepo);
        return new BlogsAuthz(checker);
    },
    inject: [BlogsRepository],
};
