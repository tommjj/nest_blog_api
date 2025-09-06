import z from 'zod/v4';

export const SignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(32),
});
export type SignInBody = z.infer<typeof SignInSchema>;
