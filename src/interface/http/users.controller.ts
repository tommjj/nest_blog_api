import { Controller, Post, Inject, UsePipes, Body } from '@nestjs/common';
import type { IUsersService } from 'src/core/port/users.port';
import { USERS_SERVICE } from 'src/infrastructure/providers/users.provider';
import { ZodValidationPipe } from './pipes/zod.pipe';
import * as usersZod from './dto/users.zod';
import { newUserResponse } from './dto/users.dto';

@Controller('users')
export class UserController {
    constructor(@Inject(USERS_SERVICE) private userService: IUsersService) {}

    @Post()
    @UsePipes(new ZodValidationPipe(usersZod.createUserSchema))
    async register(@Body() createUserBody: usersZod.CreateUserBody) {
        const created = await this.userService.registerUser(createUserBody);

        return newUserResponse(created);
    }
}
