import z from 'zod';

import { TokenPayload } from '../../../core/domain/auth';
import { errors } from '../../../core/domain/errors';

const tokenPayloadZodSchema = z.object({
    id: z.int(),
    name: z.string(),
    email: z.string(),
});

function toTokenPayload(value: any): TokenPayload {
    const parsed = tokenPayloadZodSchema.safeParse(value);
    if (!parsed.success) {
        throw errors.InvalidData(parsed.error.message, undefined, parsed.error);
    }

    return parsed.data;
}

export const jwtDto = {
    toTokenPayload,
} as const;
