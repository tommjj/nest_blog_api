import {
    Controller,
    Inject,
    Get,
    Query,
    UsePipes,
    Param,
} from '@nestjs/common';

import type {
    IBlogsAuthz,
    IBlogsSearchService,
} from 'src/core/port/blogs.port';
import type { TokenPayload } from 'src/core/domain/auth';

import {
    BLOGS_AUTHZ,
    BLOGS_SEARCH_SERVICE,
} from 'src/infrastructure/providers/blogs.provider';

import { AuthPayload } from './decorator/auth-payload.decorator';
import { pageSchema, searchBlogSchema } from './dto/blogs.zod';
import type { PageQuery, SearchBlogQuery } from './dto/blogs.zod';
import { ZodValidationPipe } from './pipes/zod.pipe';
import { newSearchBlogResponse } from './dto/blogs.dto';
import { IntPipe } from './pipes/param.pipe';

@Controller('search')
export class BlogsSearchController {
    constructor(
        @Inject(BLOGS_SEARCH_SERVICE)
        private blogsSearchService: IBlogsSearchService,
        @Inject(BLOGS_AUTHZ) private blogsAuthz: IBlogsAuthz,
    ) {}

    @Get('blogs')
    @UsePipes(new ZodValidationPipe(searchBlogSchema, 'query'))
    async search(
        @Query() query: SearchBlogQuery,
        @AuthPayload() token?: TokenPayload,
    ) {
        await this.blogsAuthz.canSearchBlogs(token);

        const offset = (query.page - 1) * query.limit;
        const result = await this.blogsSearchService.searchBlogs(
            query.q,
            query.limit,
            offset,
        );

        return newSearchBlogResponse(result);
    }

    @Get('blogs/author/:id')
    @UsePipes(new ZodValidationPipe(pageSchema, 'query'))
    async findBlogByAuthorId(
        @Param('id', IntPipe) id: number,
        @Query() query: PageQuery,
        @AuthPayload() token?: TokenPayload,
    ) {
        await this.blogsAuthz.canSearchBlogs(token);

        const offset = (query.page - 1) * query.limit;
        const result = await this.blogsSearchService.findBlogsByAuthor(
            id,
            query.limit,
            offset,
        );

        return newSearchBlogResponse(result);
    }
}
