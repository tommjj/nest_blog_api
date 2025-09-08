import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { Blog } from 'src/core/domain/blogs';
import {
    CreateBlog,
    IBlogRepository,
    UpdateBlog,
} from 'src/core/port/blogs.port';
import { errors } from 'src/core/domain/errors';

import { withError } from 'src/common/helper/withError';
import * as schema from '../db/schema';
import { DB_CLIENT } from '../db/sqlite.module';
import type { SQLiteDB } from '../db/sqlite.module';
import {
    handleDeleteError,
    handleFindError,
    handleInsertError,
    handleUpdateError,
} from './helper';
import { blogDto } from './dto/blogs.dto';

/**
 * BlogsRepository implements IBlogRepository
 */
@Injectable()
export class BlogsRepository implements IBlogRepository {
    constructor(@Inject(DB_CLIENT) private db: SQLiteDB) {}

    async createBlog(blog: CreateBlog): Promise<Blog> {
        const createdResult = await withError(
            this.db
                .insert(schema.blogs)
                .values({
                    authorId: blog.authorId,
                    content: blog.content,
                    title: blog.title,
                })
                .returning(),
        );
        if (!createdResult.ok) {
            handleInsertError(createdResult.error);
        }

        return blogDto.toBlog(createdResult.data[0]);
    }

    async getBlogByID(id: number): Promise<Blog> {
        const result = await withError(
            this.db.select().from(schema.blogs).where(eq(schema.blogs.id, id)),
        );
        if (!result.ok) {
            handleFindError(result.error);
        }
        if (result.data.length === 0) {
            throw errors.NotFound('blog not found');
        }

        return blogDto.toBlog(result.data[0]);
    }

    async updateBlog(blog: UpdateBlog): Promise<Blog> {
        const result = await withError(
            this.db
                .update(schema.blogs)
                .set({
                    content: blog.content,
                    title: blog.title,
                })
                .where(eq(schema.blogs.id, blog.id))
                .returning(),
        );
        if (!result.ok) {
            handleUpdateError(result.error);
        }
        if (result.data.length === 0) {
            throw errors.NotFound(`blog with id ${blog.id} not found`);
        }

        return blogDto.toBlog(result.data[0]);
    }

    async deleteBlog(id: number): Promise<void> {
        const result = await withError(
            this.db.delete(schema.blogs).where(eq(schema.blogs.id, id)),
        );
        if (!result.ok) {
            handleDeleteError(result.error);
        }
        if (result.data.rowsAffected === 0) {
            throw errors.NotFound(`blog with id ${id} not found`);
        }
    }
}
