import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TokenPayload } from 'src/core/domain/auth';
import { errors } from 'src/core/domain/errors';
import type { ITokenVerifyService } from 'src/core/port/auth.port';
import { TOKEN_VERIFY_SERVICE } from 'src/infrastructure/providers/auth.provider';

// authorizationType is the accepted authorization type
const authorizationType = 'bearer';
// authorizationPayloadKey is the key for authorization payload in the context
const authorizationPayloadKey = 'authorization_payload';

/**
 * MustParseToken must parse token
 */
@Injectable()
export class MustParseToken implements NestMiddleware {
    constructor(
        @Inject(TOKEN_VERIFY_SERVICE)
        private tokenVerifyService: ITokenVerifyService,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;

        if (!token) {
            throw errors.TokenMissing();
        }

        const [authType, accessToken] = token.split(' ', 2);

        if (authType.toLowerCase() !== authorizationType) {
            throw errors.TokenTypeInvalid();
        }

        // throw token error if token invalid
        const payload = this.tokenVerifyService.verifyToken(accessToken);

        req[authorizationPayloadKey] = payload;

        next();
    }
}

@Injectable()
export class ParseTokenMiddleware implements NestMiddleware {
    constructor(
        @Inject(TOKEN_VERIFY_SERVICE)
        private tokenVerifyService: ITokenVerifyService,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;

        if (!token) {
            return next();
        }

        const [authType, accessToken] = token.split(' ', 2);

        if (authType.toLowerCase() !== authorizationType) {
            throw errors.TokenTypeInvalid();
        }

        // throw token error if token invalid
        const payload = this.tokenVerifyService.verifyToken(accessToken);

        req[authorizationPayloadKey] = payload;

        next();
    }
}

export function getTokenPayload(req: Request) {
    const payload = req[authorizationPayloadKey] as undefined | TokenPayload;
    return payload;
}

export function mustGetTokenPayload(req: Request) {
    const payload = req[authorizationPayloadKey] as undefined | TokenPayload;
    if (!payload) {
        throw errors.Unauthorized();
    }

    return payload;
}
