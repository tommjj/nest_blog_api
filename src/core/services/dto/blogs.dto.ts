import { Blog } from 'src/core/domain/blogs';
import { ParseResult } from './type';

import z from 'zod/v4';

// * parser

const blogZodSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    authorId: z.number(),

    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
});

function toBlog(v: any): ParseResult<Blog> {
    const parsed = blogZodSchema.safeParse(v);
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
    toBlog,
};
