import { errors } from '../../core/domain/errors';

export function handleInsertError(err: unknown): never {
    if (err instanceof Error && 'rawCode' in err) {
        const e = err as { rawCode: number; message: string };

        switch (e.rawCode) {
            case 1555: // SQLite constraint: UNIQUE constraint failed
                throw errors.newDataExists(e.message, { rawCode: e.rawCode });

            case 275: // SQLite constraint: CHECK constraint failed
                throw errors.newInvalidData(e.message, { rawCode: e.rawCode });

            default:
                throw errors.newDatabase(
                    e.message,
                    { rawCode: e.rawCode },
                    err,
                );
        }
    }

    if (err instanceof Error) {
        throw errors.newInternal(err.message, undefined, err);
    }

    throw errors.newUnknown('Unknown error', undefined, err);
}
export function handleUpdateError(err: unknown): never {
    if (err instanceof Error && 'rawCode' in err) {
        const e = err as { rawCode: number; message: string };

        switch (e.rawCode) {
            case 275: // SQLite CHECK constraint failed
                throw errors.newInvalidData(e.message, { rawCode: e.rawCode });

            default:
                throw errors.newDatabase(
                    e.message,
                    { rawCode: e.rawCode },
                    err,
                );
        }
    }

    if (err instanceof Error) {
        throw errors.newInternal(err.message, undefined, err);
    }

    throw errors.newUnknown('Unknown error', undefined, err);
}

/**
 * handleDeleteError converts raw DB errors into DomainError
 */
export function handleDeleteError(err: unknown): never {
    if (err instanceof Error && 'rawCode' in err) {
        const e = err as { rawCode: number; message: string };
        throw errors.newDatabase(e.message, { rawCode: e.rawCode }, err);
    }

    if (err instanceof Error) {
        throw errors.newInternal(err.message, undefined, err);
    }

    throw errors.newUnknown('Unknown error', undefined, err);
}

/**
 * handleFindError converts raw DB errors into DomainError
 */
export function handleFindError(err: unknown): never {
    if (err instanceof Error && 'rawCode' in err) {
        const e = err as { rawCode: number; message: string };
        throw errors.newDatabase(e.message, { rawCode: e.rawCode }, err);
    }

    if (err instanceof Error) {
        throw errors.newInternal(err.message, undefined, err);
    }

    throw errors.newUnknown('Unknown error', undefined, err);
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const ret = { ...obj };
    for (const key of keys) {
        delete ret[key];
    }
    return ret;
}
