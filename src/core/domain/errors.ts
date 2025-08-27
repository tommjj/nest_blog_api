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
        privateMessage?: string,
        metadata?: Record<string, any>,
    ) {
        super(publicMessage);
        this.name = 'DomainError';

        this.type = type;
        this.publicMessage = publicMessage;
        this.privateMessage = privateMessage || publicMessage;
        this.metadata = metadata;
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
