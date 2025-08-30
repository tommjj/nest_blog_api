import { Module } from '@nestjs/common';
import { JWTAdapter } from './jwt.adapter';

export const JWT_PORT = Symbol('JWT_PORT');

@Module({
    providers: [
        {
            provide: JWT_PORT,
            useClass: JWTAdapter,
        },
    ],
    exports: [JWT_PORT],
})
export class AuthModule {}
