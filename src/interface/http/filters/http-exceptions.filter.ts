import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod/v4';

import { ErrorType, DomainError } from 'src/core/domain/errors';
import * as loggerPort from 'src/core/port/logger.port';
import { LOGGER_PORT } from 'src/infrastructure/logger/logger.module';

import { HTTPErrorResponse } from '../dto/response';

const errorStatusMap: Record<ErrorType, number> = {
    [ErrorType.ErrNotFound]: HttpStatus.NOT_FOUND,
    [ErrorType.ErrInternal]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorType.ErrInvalidData]: HttpStatus.BAD_REQUEST,
    [ErrorType.ErrDataExists]: HttpStatus.CONFLICT,
    [ErrorType.ErrDataConflicting]: HttpStatus.CONFLICT,
    [ErrorType.ErrDataVersionConflict]: HttpStatus.CONFLICT,
    [ErrorType.ErrNoDataUpdated]: HttpStatus.BAD_REQUEST,
    [ErrorType.ErrForBidden]: HttpStatus.FORBIDDEN,
    [ErrorType.ErrValidation]: HttpStatus.BAD_REQUEST,
    [ErrorType.ErrDatabase]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorType.ErrUnauthorized]: HttpStatus.UNAUTHORIZED,
    [ErrorType.ErrUnknown]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorType.ErrConfigMissing]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorType.ErrConfigInvalid]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorType.ErrInvalidCredentials]: HttpStatus.UNAUTHORIZED,
    [ErrorType.ErrTokenMissing]: HttpStatus.UNAUTHORIZED,
    [ErrorType.ErrTokenExpired]: HttpStatus.UNAUTHORIZED,
    [ErrorType.ErrTokenInvalid]: HttpStatus.UNAUTHORIZED,
    [ErrorType.ErrTokenTypeInvalid]: HttpStatus.UNAUTHORIZED,
};

function getStatus(type: ErrorType): number {
    return errorStatusMap[type] || HttpStatus.INTERNAL_SERVER_ERROR;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(LOGGER_PORT) private logx: loggerPort.ILoggerPort) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        // set default value
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let details: unknown = undefined;

        if (exception instanceof DomainError) {
            status = getStatus(exception.type);
            message = exception.publicMessage;

            if (exception.is(ErrorType.ErrInvalidData)) {
                details = this.parseZodError(exception.cause);
            }

            if (this.isInternal(exception)) {
                this.logx.error(
                    `${exception.privateMessage}: ${exception.cause as any}`,
                    { path: req.url },
                );
            }
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message || (exception.getResponse() as string);
        } else {
            this.logx.error(`Unknown error: ${exception as any}`, {
                path: req.url,
            });
        }

        res.status(status).json({
            success: false,
            path: req.url,
            message,
            details,
            timestamp: new Date().toISOString(),
        } as HTTPErrorResponse<unknown>);
    }

    /**
     * parseZodError is a helper function parse zod error, return undefined if error is not instanceof ZodError
     *
     * @param error
     * @returns
     */
    private parseZodError(error: unknown): unknown {
        if (!(error instanceof ZodError)) {
            return undefined;
        }

        const issues = error.issues;

        return issues.map((it) => ({
            path: Array.isArray(it.path) ? it.path.join('.') : it.path,
            message: it.message,
        }));
    }

    private isInternal(err: unknown): boolean {
        if (!(err instanceof DomainError)) {
            return true;
        }

        return (
            err.type === ErrorType.ErrInternal ||
            err.type === ErrorType.ErrUnknown
        );
    }
}
