/**
 * ErrorType is an enumeration of error types
 */
export enum ErrorType {
    // General Errors
    ErrDataExists = 'DataExists',
    ErrInternal = 'Internal',
    ErrInvalidData = 'InvalidData',
    ErrDataConflicting = 'DataConflicting',
    ErrDataVersionConflict = 'DataVersionConflict',
    ErrNotFound = 'NotFound',
    ErrNoDataUpdated = 'NoDataUpdated',
    ErrForBidden = 'Forbidden',
    ErrValidation = 'Validation',
    ErrDatabase = 'Database',
    ErrUnauthorized = 'Unauthorized',
    ErrUnknown = 'Unknown',

    // Token Errors
    ErrTokenMissing = 'TokenMissing',
    ErrTokenExpired = 'TokenExpired',
    ErrTokenInvalid = 'TokenInvalid',
}

/**
 * DomainError is a custom error class for domain layer
 */
export class DomainError extends Error {
    public readonly publicMessage: string;
    public readonly privateMessage: string;

    public readonly type: ErrorType;

    public readonly metadata?: Record<string, any>;

    constructor(
        type: ErrorType,
        publicMessage: string,
        options: {
            cause?: unknown;
            privateMessage?: string;
            metadata?: Record<string, any>;
        },
    ) {
        super(publicMessage, { cause: options.cause });
        this.name = 'DomainError';
        this.type = type;
        this.publicMessage = publicMessage;

        this.privateMessage = options.privateMessage || publicMessage;
        this.metadata = options.metadata;
    }

    toString() {
        return `${this.type}: ${this.privateMessage}`;
    }

    toPublicString() {
        return `${this.type}: ${this.publicMessage}`;
    }

    toJSON() {
        return {
            name: this.name,
            type: this.type,
            publicMessage: this.publicMessage,
            privateMessage: this.privateMessage,
            metadata: this.metadata,
        };
    }

    is(type: ErrorType | DomainError) {
        if (type instanceof DomainError) {
            return this.type === type.type;
        }
        return this.type === type;
    }
}

type NewErrorFunc<T extends ErrorType> = {
    [K in T]: (
        msg?: string,
        metadata?: Record<string, any>,
        cause?: unknown,
    ) => DomainError;
};

type ThrowErrorFunc<T extends ErrorType> = {
    [K in T]: (
        msg?: string,
        metadata?: Record<string, any>,
        cause?: unknown,
    ) => never;
};

export function createErrors<T extends { type: ErrorType; pMgs: string }>(
    O: T[],
): NewErrorFunc<T['type']> {
    return O.reduce(
        (fac, item) => {
            fac[item.type] = (
                msg?: string,
                metadata?: Record<string, any>,
                cause?: unknown,
            ) =>
                new DomainError(item.type, item.pMgs, {
                    privateMessage: msg,
                    metadata,
                    cause,
                });
            return fac;
        },
        {} as NewErrorFunc<T['type']>,
    );
}

export function createThrowErrors<T extends { type: ErrorType; pMgs: string }>(
    O: T[],
): ThrowErrorFunc<T['type']> {
    return O.reduce(
        (fac, item) => {
            fac[item.type] = (
                msg?: string,
                metadata?: Record<string, any>,
                cause?: unknown,
            ) => {
                throw new DomainError(item.type, item.pMgs, {
                    privateMessage: msg,
                    metadata,
                    cause,
                });
            };
            return fac;
        },
        {} as ThrowErrorFunc<T['type']>,
    );
}

const errorConfigs = [
    // General Errors
    {
        type: ErrorType.ErrDataExists,
        pMgs: 'Data already exists',
    },
    {
        type: ErrorType.ErrInternal,
        pMgs: 'An internal error occurred',
    },
    {
        type: ErrorType.ErrInvalidData,
        pMgs: 'Invalid data provided',
    },
    {
        type: ErrorType.ErrDataConflicting,
        pMgs: 'Data conflict detected',
    },
    {
        type: ErrorType.ErrDataVersionConflict,
        pMgs: 'Data version conflict',
    },
    {
        type: ErrorType.ErrNotFound,
        pMgs: 'Resource not found',
    },
    {
        type: ErrorType.ErrNoDataUpdated,
        pMgs: 'No data was updated',
    },
    {
        type: ErrorType.ErrForBidden,
        pMgs: 'Forbidden action',
    },
    {
        type: ErrorType.ErrValidation,
        pMgs: 'Validation failed',
    },
    {
        type: ErrorType.ErrDatabase,
        pMgs: 'Database error',
    },
    {
        type: ErrorType.ErrUnauthorized,
        pMgs: 'Unauthorized access',
    },
    {
        type: ErrorType.ErrUnknown,
        pMgs: 'An unknown error occurred',
    },

    // Token Errors
    {
        type: ErrorType.ErrTokenMissing,
        pMgs: 'Token missing',
    },
    {
        type: ErrorType.ErrTokenExpired,
        pMgs: 'Token has expired',
    },
    {
        type: ErrorType.ErrTokenInvalid,
        pMgs: 'Invalid token',
    },
];

const errorFuncs = createErrors(errorConfigs);
const throwErrorFuncs = createThrowErrors(errorConfigs);

export const errors = {
    ...errorFuncs,
    t: {
        ...throwErrorFuncs,
    },
};
