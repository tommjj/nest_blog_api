import { Injectable, Inject } from '@nestjs/common';
import { count, eq, like } from 'drizzle-orm';

import { BlogsSearchResult, IBlogsSearchPort } from 'src/core/port/blogs.port';
import { errors } from 'src/core/domain/errors';

import { withError } from 'src/common/helper/withError';
import * as schema from '../db/schema';
import { DB_CLIENT } from '../db/sqlite.module';
import type { SQLiteDB } from '../db/sqlite.module';
import { handleFindError } from './helper';
import { blogDto } from './dto/blogs.dto';

/**
 * BlogsSearchRepository implements IBlogsSearchPort
 */
@Injectable()
export class BlogsSearchRepository implements IBlogsSearchPort {
    constructor(@Inject(DB_CLIENT) private db: SQLiteDB) {}

    async searchBlogs(
        keyword: string,
        limit: number = 0,
        offset: number = 0,
    ): Promise<BlogsSearchResult> {
        const count = await this.countBlogs(keyword);
        if (count <= offset) {
            throw errors.NotFound('blogs not found');
        }

        const result = await withError(
            this.db
                .select()
                .from(schema.blogs)
                .where(like(schema.blogs.title, `%${keyword}%`))
                .limit(limit)
                .offset(offset),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }
        if (result.data.length === 0) {
            throw errors.NotFound('blogs not found');
        }

        return {
            total: count,
            hits: result.data.map((b) => blogDto.toBlog(b)),
            limit: limit,
            offset: offset,
        };
    }

    async findBlogsByAuthor(
        authorId: number,
        limit: number = 0,
        offset: number = 0,
    ): Promise<BlogsSearchResult> {
        const count = await this.countBlogsByAuthor(authorId);
        if (count <= offset) {
            throw errors.NotFound('blogs not found');
        }

        const result = await withError(
            this.db
                .select()
                .from(schema.blogs)
                .where(eq(schema.blogs.authorId, authorId))
                .limit(limit)
                .offset(offset),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }
        if (result.data.length === 0) {
            throw errors.NotFound('blogs not found');
        }

        return {
            total: count,
            hits: result.data.map((b) => blogDto.toBlog(b)),
            limit: limit,
            offset: offset,
        };
    }

    async countBlogsByAuthor(authorId: number): Promise<number> {
        const result = await withError(
            this.db
                .select({ count: count() })
                .from(schema.blogs)
                .where(eq(schema.blogs.authorId, authorId)),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }

        return result.data[0]?.count || 0;
    }

    async countBlogs(keyword?: string): Promise<number> {
        const result = await withError(
            this.db
                .select({ count: count() })
                .from(schema.blogs)
                .where(like(schema.blogs.title, `%${keyword}%`)),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }

        return result.data[0]?.count || 0;
    }
}
