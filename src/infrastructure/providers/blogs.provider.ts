import { Provider } from '@nestjs/common';

import { IBlogsRepository, IBlogsSearchPort } from 'src/core/port/blogs.port';
import BlogsService from 'src/core/services/blogs.service';

import { BlogsRepository } from '../repository/blogs.repository';
import BlogsSearchService from 'src/core/services/blogs_search.service';
import { BlogsSearchRepository } from '../repository/blog_search.repository';
import { BlogsAuthz } from 'src/core/authz/blog.authz';
import BlogOwnershipCheckerService from 'src/core/services/blog_ornership_checker.service';

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

export const BLOGS_AUTHZ = Symbol('BLOGS_AUTHZ');
export const blogsAuthzProvider: Provider = {
    provide: BLOGS_AUTHZ,
    useFactory(blogsRepo: IBlogsRepository) {
        const checker = new BlogOwnershipCheckerService(blogsRepo);
        return new BlogsAuthz(checker);
    },
    inject: [BlogsRepository],
};
