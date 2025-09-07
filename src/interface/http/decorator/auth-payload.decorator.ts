import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import {
    getTokenPayload,
    mustGetTokenPayload,
} from '../middleware/parse_token.middleware';

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
 * @throws throws Unauthorized if token not set
 */
export const MustAuthPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<Request>();
        return mustGetTokenPayload(req);
    },
);
