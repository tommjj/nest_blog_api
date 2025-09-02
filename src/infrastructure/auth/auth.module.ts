import { Module } from '@nestjs/common';
import { JWTTokenAdapter } from './jwt.adapter';
import { Argon2PasswordAdapter } from './password.adapter';

@Module({
    providers: [JWTTokenAdapter, Argon2PasswordAdapter],
    exports: [JWTTokenAdapter, Argon2PasswordAdapter],
})
export class AuthModule {}
