import {
    Controller,
    Post,
    Inject,
    UsePipes,
    Body,
    Param,
    Get,
    Patch,
} from '@nestjs/common';
import type { IUsersService } from 'src/core/port/users.port';
import { USERS_SERVICE } from 'src/infrastructure/providers/users.provider';
import { ZodValidationPipe } from './pipes/zod.pipe';
import * as usersZod from './dto/users.zod';
import { newUserResponse } from './dto/users.dto';
import { IntPipe } from './pipes/param.pipe';

@Controller('users')
export class UserController {
    constructor(@Inject(USERS_SERVICE) private userService: IUsersService) {}

    @Post()
    @UsePipes(new ZodValidationPipe(usersZod.createUserSchema))
    async register(@Body() createUserBody: usersZod.CreateUserBody) {
        const created = await this.userService.registerUser(createUserBody);

        return newUserResponse(created);
    }

    @Get(':id')
    async getUserProfileByID(@Param('id', IntPipe) id: number) {
        const user = await this.userService.getUserProfile(id);

        return newUserResponse(user);
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(usersZod.updateUserSchema))
    async updateUserProfile(
        @Param('id', IntPipe) id: number,
        @Body() updateUserBody: usersZod.UpdateUserBody,
    ) {
        const user = await this.userService.updateUserProfile({
            id: id,
            name: updateUserBody.name,
            email: updateUserBody.email,
        });

        return newUserResponse(user);
    }
}
