import z from 'zod/v4';

export const createBlogSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
});

export type CreateBlogBody = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = z
    .object({
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
    })
    .refine(
        ({ title, content }) => title !== undefined || content !== undefined,
        {
            message: 'At least one title or content is required',
        },
    );

export type UpdateBlogBody = z.infer<typeof updateBlogSchema>;

export const searchBlogSchema = z.object({
    q: z.string().max(255).default(''),
    limit: z.coerce.number().int().min(5).max(50).default(10),
    page: z.coerce.number().int().min(1).default(1),
});

export type SearchBlogQuery = z.infer<typeof searchBlogSchema>;

export const pageSchema = z.object({
    limit: z.coerce.number().int().min(5).max(50).default(10),
    page: z.coerce.number().int().min(1).default(1),
});

export type PageQuery = z.infer<typeof pageSchema>;
