import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { mustGetTokenPayload } from '../middleware/parse_token.middleware';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        mustGetTokenPayload(request);
        return true;
    }
}
