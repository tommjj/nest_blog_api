import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
    getTokenPayload,
    mustGetTokenPayload,
} from '../middleware/parse_token.middleware';
import { AuthGuard } from '../guards/auth.guard';

/**
 * AuthPayload
 * @returns return token payload | undefined
 */
export const AuthPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<Request>();
        return getTokenPayload(req);
    },
);

/**
 * AuthPayload
 * @returns return token payload
 * @throws throws Unauthorized if token is not set
 */
export const MustAuthPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<Request>();
        return mustGetTokenPayload(req);
    },
);

/**
 * MustAuth is a decorator for handler, active route if user is authenticate
 */
export function MustAuth() {
    return applyDecorators(UseGuards(AuthGuard));
}
