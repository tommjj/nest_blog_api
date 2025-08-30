import { DomainError, errors } from '../domain/errors';

// handleError
export function handleError(error: unknown): never {
    if (error instanceof DomainError) {
        throw error;
    }

    if (error instanceof Error) {
        throw errors.Internal(error.message, undefined, error);
    }

    throw errors.Unknown(undefined, undefined, error);
}
