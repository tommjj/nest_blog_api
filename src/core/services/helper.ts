import { DomainError, errors, ErrorType } from '../domain/errors';

export function handleError(
    error: unknown,
    options?: {
        skip?: ErrorType[];
        replace?: {
            type: ErrorType;
            by: DomainError;
        }[];
    },
): { skip: boolean; err: DomainError } {
    if (!(error instanceof DomainError)) {
        return {
            skip: false,
            err: errors.Internal('Internal', undefined, error),
        };
    }

    const skipList = options?.skip ?? [];
    if (skipList.some((e) => error.is(e))) {
        return { skip: true, err: error };
    }

    const replaceList = options?.replace ?? [];
    const replacement = replaceList.find((e) => error.is(e.type));
    if (replacement) {
        return { skip: false, err: replacement.by };
    }

    return { skip: false, err: error };
}
