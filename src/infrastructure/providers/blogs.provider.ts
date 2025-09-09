import { Provider } from '@nestjs/common';

import { IBlogsRepository, IBlogsSearchPort } from 'src/core/port/blogs.port';
import BlogsService from 'src/core/services/blogs.service';

import { BlogsRepository } from '../repository/blogs.repository';
import BlogsSearchService from 'src/core/services/blogs_search.service';
import { BlogsSearchRepository } from '../repository/blog_search.repository';

export const BLOGS_SERVICE = Symbol('BLOGS_SERVICE');
export const blogsProvider: Provider = {
    provide: BLOGS_SERVICE,
    useFactory(blogsRepo: IBlogsRepository) {
        return new BlogsService(blogsRepo);
    },
    inject: [BlogsRepository],
};

export const BLOGS_SEARCH_SERVICE = Symbol('BLOGS_SEARCH_SERVICE');
export const blogsSearchProvider: Provider = {
    provide: BLOGS_SEARCH_SERVICE,
    useFactory(blogsSearchPort: IBlogsSearchPort) {
        return new BlogsSearchService(blogsSearchPort);
    },
    inject: [BlogsSearchRepository],
};
