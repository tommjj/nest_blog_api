import z from 'zod/v4';

export const createUserSchema = z.object({
    email: z.email(),
    name: z.string().min(3).max(127),
    password: z.string().min(8).max(32),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
    .object({
        email: z.email().optional(),
        name: z.string().min(3).max(127).optional(),
    })
    .refine(({ email, name }) => name !== undefined || email !== undefined, {
        message: 'At least one email or name is required',
    });

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
