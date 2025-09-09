import {
    Controller,
    Post,
    Inject,
    UsePipes,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import type { IBlogsAuthz, IBlogsService } from 'src/core/port/blogs.port';
import type { TokenPayload } from 'src/core/domain/auth';

import {
    BLOGS_AUTHZ,
    BLOGS_SERVICE,
} from 'src/infrastructure/providers/blogs.provider';
import {
    AuthPayload,
    MustAuthPayload,
} from './decorator/auth-payload.decorator';

import type { CreateBlogBody, UpdateBlogBody } from './dto/blogs.zod';
import { createBlogSchema, updateBlogSchema } from './dto/blogs.zod';
import { newBlogResponse } from './dto/blogs.dto';
import { newSuccessResponse } from './dto/response';
import { ZodValidationPipe } from './pipes/zod.pipe';
import { IntPipe } from './pipes/param.pipe';

@Controller('blogs')
export class BlogsController {
    constructor(
        @Inject(BLOGS_SERVICE) private blogsService: IBlogsService,
        @Inject(BLOGS_AUTHZ) private blogsAuthz: IBlogsAuthz,
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(createBlogSchema, 'body'))
    async createBlog(
        @Body() createBlogBody: CreateBlogBody,
        @MustAuthPayload() tokenPayload: TokenPayload,
    ) {
        await this.blogsAuthz.canCreateBlog(tokenPayload);

        const userId = tokenPayload.id;

        const blog = await this.blogsService.createBlog({
            title: createBlogBody.title,
            content: createBlogBody.content,
            authorId: userId,
        });

        return newBlogResponse(blog);
    }

    @Get(':id')
    async getBlogById(
        @Param('id', IntPipe) id: number,
        @AuthPayload() tokenPayload?: TokenPayload,
    ) {
        await this.blogsAuthz.canGetBlog(tokenPayload, id);

        const blog = await this.blogsService.getBlogByID(id);

        return newBlogResponse(blog);
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(updateBlogSchema, 'body'))
    async updateBlog(
        @Param('id', IntPipe) id: number,
        @Body() updateBlogBody: UpdateBlogBody,
        @MustAuthPayload() tokenPayload: TokenPayload,
    ) {
        await this.blogsAuthz.canUpdateBlog(tokenPayload, id);

        const blog = await this.blogsService.updateBlog({
            id: id,
            title: updateBlogBody.title,
            content: updateBlogBody.content,
        });

        return newBlogResponse(blog);
    }

    @Delete(':id')
    async deleteBlog(
        @Param('id', IntPipe) id: number,
        @MustAuthPayload() tokenPayload: TokenPayload,
    ) {
        await this.blogsAuthz.canDeleteBlog(tokenPayload, id);

        await this.blogsService.deleteBlog(id);

        return newSuccessResponse(undefined, 'blog deleted');
    }
}
