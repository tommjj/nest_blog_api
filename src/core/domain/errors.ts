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
        super(publicMessage);
        this.name = 'DomainError';
        this.type = type;
        this.publicMessage = publicMessage;

        this.cause = options.cause;
        this.privateMessage = options.privateMessage || publicMessage;
        this.metadata = options.metadata;
    }

    toString() {
        return `${this.type}: ${this.privateMessage}`;
    }

    toPublicString() {
        return `${this.type}: ${this.publicMessage}`;
    }

    is(type: ErrorType | DomainError) {
        if (type instanceof DomainError) {
            return this.type === type.type;
        }
        return this.type === type;
    }
}

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
}

/**
 * ErrorFactory is a helper to create DomainError instances
 */
/**
 * ErrorFactory is a helper to create DomainError instances
 */
class ErrorFactory {
    constructor() {}

    newDataExists(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(ErrorType.ErrDataExists, 'Data already exists', {
            privateMessage,
            metadata,
        });
    }

    newInternal(
        privateMessage: string,
        metadata?: Record<string, any>,
        cause?: unknown,
    ) {
        return new DomainError(
            ErrorType.ErrInternal,
            'An internal error occurred',
            {
                privateMessage,
                metadata,
                cause,
            },
        );
    }

    newInvalidData(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(
            ErrorType.ErrInvalidData,
            'Invalid data provided',
            {
                privateMessage,
                metadata,
            },
        );
    }

    newDataConflicting(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(
            ErrorType.ErrDataConflicting,
            'Data conflict detected',
            {
                privateMessage,
                metadata,
            },
        );
    }

    newDataVersionConflict(
        privateMessage: string,
        metadata?: Record<string, any>,
    ) {
        return new DomainError(
            ErrorType.ErrDataVersionConflict,
            'Data version conflict',
            {
                privateMessage,
                metadata,
            },
        );
    }

    newNotFound(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(ErrorType.ErrNotFound, 'Resource not found', {
            privateMessage,
            metadata,
        });
    }

    newNoDataUpdated(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(
            ErrorType.ErrNoDataUpdated,
            'No data was updated',
            {
                privateMessage,
                metadata,
            },
        );
    }

    newForbidden(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(ErrorType.ErrForBidden, 'Forbidden action', {
            privateMessage,
            metadata,
        });
    }

    newValidation(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(ErrorType.ErrValidation, 'Validation failed', {
            privateMessage,
            metadata,
        });
    }

    newDatabase(
        privateMessage: string,
        metadata?: Record<string, any>,
        cause?: unknown,
    ) {
        return new DomainError(ErrorType.ErrDatabase, 'Database error', {
            privateMessage,
            metadata,
            cause,
        });
    }

    newUnauthorized(privateMessage: string, metadata?: Record<string, any>) {
        return new DomainError(
            ErrorType.ErrUnauthorized,
            'Unauthorized access',
            {
                privateMessage,
                metadata,
            },
        );
    }

    newUnknown(
        privateMessage: string,
        metadata?: Record<string, any>,
        cause?: unknown,
    ) {
        return new DomainError(
            ErrorType.ErrUnknown,
            'An unknown error occurred',
            {
                privateMessage,
                metadata,
                cause,
            },
        );
    }
}

/**
 * errors is a ErrorFactory
 */
export const errors = new ErrorFactory();
