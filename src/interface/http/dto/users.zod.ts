import z from 'zod/v4';

export const createUserSchema = z.object({
    email: z.email(),
    name: z.string().min(3).max(127),
    password: z.string().min(8).max(32),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
