import {
    Controller,
    Inject,
    Post,
    UsePipes,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import type { IAuthService } from 'src/core/port/auth.port';
import { AUTH_SERVICE } from 'src/infrastructure/providers/auth.provider';

import { ZodBodyValidationPipe } from './pipes/zod.pipe';
import { SignInSchema } from './dto/auth.zod';
import type { SignInBody } from './dto/auth.zod';
import { newAuthResponse } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) {}

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodBodyValidationPipe(SignInSchema))
    async signin(@Body() signinBody: SignInBody) {
        const token = await this.authService.authenticateUser(
            signinBody.email,
            signinBody.password,
        );

        return newAuthResponse(token);
    }
}
