/**
 * ErrorType is an enumeration of error types
 */
export enum ErrorType {
    ErrConfigMissing = 'ConfigMissing',
    ErrConfigInvalid = 'ConfigInvalid',

    // General Errors
    ErrInvalidCredentials = 'InvalidCredentials',
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
    ErrTokenTypeInvalid = 'TokenTypeInvalid',
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

export function createErrors<T extends { type: ErrorType; publicMgs: string }>(
    O: T[],
): NewErrorFunc<T['type']> {
    return O.reduce(
        (fac, item) => {
            fac[item.type] = (
                msg?: string,
                metadata?: Record<string, any>,
                cause?: unknown,
            ) =>
                new DomainError(item.type, item.publicMgs, {
                    privateMessage: msg,
                    metadata,
                    cause,
                });
            return fac;
        },
        {} as NewErrorFunc<T['type']>,
    );
}

export function createThrowErrors<
    T extends { type: ErrorType; publicMgs: string },
>(O: T[]): ThrowErrorFunc<T['type']> {
    return O.reduce(
        (fac, item) => {
            fac[item.type] = (
                msg?: string,
                metadata?: Record<string, any>,
                cause?: unknown,
            ) => {
                throw new DomainError(item.type, item.publicMgs, {
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
    // Config Errors
    {
        type: ErrorType.ErrInvalidCredentials,
        publicMgs: 'User credentials invalid',
    },
    {
        type: ErrorType.ErrConfigMissing,
        publicMgs: 'Config Missing',
    },
    {
        type: ErrorType.ErrConfigInvalid,
        publicMgs: 'Invalid Config',
    },
    // General Errors
    {
        type: ErrorType.ErrDataExists,
        publicMgs: 'Data already exists',
    },
    {
        type: ErrorType.ErrInternal,
        publicMgs: 'An internal error occurred',
    },
    {
        type: ErrorType.ErrInvalidData,
        publicMgs: 'Invalid data provided',
    },
    {
        type: ErrorType.ErrDataConflicting,
        publicMgs: 'Data conflict detected',
    },
    {
        type: ErrorType.ErrDataVersionConflict,
        publicMgs: 'Data version conflict',
    },
    {
        type: ErrorType.ErrNotFound,
        publicMgs: 'Resource not found',
    },
    {
        type: ErrorType.ErrNoDataUpdated,
        publicMgs: 'No data was updated',
    },
    {
        type: ErrorType.ErrForBidden,
        publicMgs: 'Forbidden action',
    },
    {
        type: ErrorType.ErrValidation,
        publicMgs: 'Validation failed',
    },
    {
        type: ErrorType.ErrDatabase,
        publicMgs: 'Database error',
    },
    {
        type: ErrorType.ErrUnauthorized,
        publicMgs: 'Unauthorized access',
    },
    {
        type: ErrorType.ErrUnknown,
        publicMgs: 'An unknown error occurred',
    },

    // Token Errors
    {
        type: ErrorType.ErrTokenMissing,
        publicMgs: 'Token missing',
    },
    {
        type: ErrorType.ErrTokenExpired,
        publicMgs: 'Token has expired',
    },
    {
        type: ErrorType.ErrTokenInvalid,
        publicMgs: 'Invalid token',
    },
    {
        type: ErrorType.ErrTokenTypeInvalid,
        publicMgs: 'Invalid token type',
    },
];

const errorFuncs = createErrors(errorConfigs);
const throwErrorFuncs = createThrowErrors(errorConfigs);

export const errors = {
    New(
        type: ErrorType,
        publicMessage: string,
        options: {
            cause?: unknown;
            privateMessage?: string;
            metadata?: Record<string, any>;
        } = {},
    ): DomainError {
        return new DomainError(type, publicMessage, options);
    },
    ...errorFuncs,
    throw: {
        New(
            type: ErrorType,
            publicMessage: string,
            options: {
                cause?: unknown;
                privateMessage?: string;
                metadata?: Record<string, any>;
            } = {},
        ): never {
            throw new DomainError(type, publicMessage, options);
        },
        ...throwErrorFuncs,
    },
} as const;
