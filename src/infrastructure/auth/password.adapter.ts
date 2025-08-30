import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IPasswordPort } from '../../core/port/auth.port';

@Injectable()
export class Argon2PasswordAdapter implements IPasswordPort {
    constructor() {}

    algorithm(): string {
        return 'argon2';
    }

    async hash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    async verify(hashedPassword: string, password: string): Promise<boolean> {
        return argon2.verify(hashedPassword, password);
    }
}
