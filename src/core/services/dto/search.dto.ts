import { BlogsSearchResult } from 'src/core/port/blogs.port';
import { ParseResult } from './type';

import z from 'zod/v4';

// * parser

const blogsSearchZodSchema = z.object({
    total: z.number(),
    hits: z.array(
        z.object({
            id: z.number(),
            title: z.string(),
            authorId: z.number(),

            updatedAt: z.coerce.date(),
            createdAt: z.coerce.date(),
        }),
    ),
    offset: z.number(),
    limit: z.number(),
});

function toBlogsSearchResult(v: any): ParseResult<BlogsSearchResult> {
    const parsed = blogsSearchZodSchema.safeParse(v);
    if (parsed.success) {
        return {
            v: parsed.data,
            ok: true,
        };
    }
    return {
        v: undefined,
        ok: false,
    };
}

export const parser = {
    toBlogsSearchResult,
};
