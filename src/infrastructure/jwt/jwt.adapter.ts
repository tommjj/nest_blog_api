import { Injectable, Inject } from '@nestjs/common';

import jwt from 'jsonwebtoken';

import type { ITokenPort } from '../../core/port/auth.port';
import { TokenPayload } from 'src/core/domain/auth';
import { ConfigService } from '@nestjs/config';
import { config } from '../utils/get_config.helper';
import { errors } from 'src/core/domain/errors';
import { jwtDto } from './jwt.dto';

@Injectable()
export class JWTAdapter implements ITokenPort {
    private secret: string;
    private expiresIn: number;

    constructor(@Inject() private conf: ConfigService) {
        this.secret = config(conf).mustString('AUTH_SECRET');

        const expiresIn = config(conf).mustInt('EXPIRES_IN');
        if (expiresIn < 0) {
            throw errors.ConfigInvalid(
                `EXPIRES_IN is not a valid positive  integer: ${expiresIn}`,
            );
        }
        this.expiresIn = expiresIn;
    }

    verifyToken(token: string): TokenPayload {
        try {
            const payload = jwt.verify(token, this.secret);

            return jwtDto.toTokenPayload(payload);
        } catch (err) {
            throw errors.TokenInvalid('Token is invalid or expired', {}, err);
        }
    }

    signToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn,
        });
    }
}
