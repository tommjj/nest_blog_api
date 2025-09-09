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
