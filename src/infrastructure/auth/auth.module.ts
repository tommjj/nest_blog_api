import { Module } from '@nestjs/common';
import { JWTAdapter } from './jwt.adapter';
import { Argon2PasswordAdapter } from './password.adapter';

export const JWT_PORT = Symbol('JWT_PORT');
export const PASSWORD_PORT = Symbol('PASSWORD_PORT');

@Module({
    providers: [
        {
            provide: JWT_PORT,
            useClass: JWTAdapter,
        },
        {
            provide: PASSWORD_PORT,
            useClass: Argon2PasswordAdapter,
        },
    ],
    exports: [JWT_PORT, PASSWORD_PORT],
})
export class AuthModule {}
