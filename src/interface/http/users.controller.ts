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

import type { IUsersAuthz, IUsersService } from 'src/core/port/users.port';

import {
    USERS_AUTHZ,
    USERS_SERVICE,
} from 'src/infrastructure/providers/users.provider';
import { ZodValidationPipe } from './pipes/zod.pipe';
import * as usersZod from './dto/users.zod';
import { newUserResponse } from './dto/users.dto';
import { IntPipe } from './pipes/param.pipe';
import {
    MustAuthPayload,
    AuthPayload,
} from './decorator/auth-payload.decorator';
import type { TokenPayload } from 'src/core/domain/auth';

@Controller('users')
export class UserController {
    constructor(
        @Inject(USERS_SERVICE) private userService: IUsersService,
        @Inject(USERS_AUTHZ) private userAuthz: IUsersAuthz,
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(usersZod.createUserSchema))
    async register(
        @Body() createUserBody: usersZod.CreateUserBody,
        @AuthPayload() tokenPayload?: TokenPayload,
    ) {
        await this.userAuthz.canRegisterUser(tokenPayload);

        const created = await this.userService.registerUser(createUserBody);

        return newUserResponse(created);
    }

    @Get(':id')
    async getUserProfileByID(
        @Param('id', IntPipe) id: number,
        @AuthPayload() tokenPayload?: TokenPayload,
    ) {
        await this.userAuthz.canGetUserProfile(tokenPayload, id);

        const user = await this.userService.getUserProfile(id);

        return newUserResponse(user);
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(usersZod.updateUserSchema))
    async updateUserProfile(
        @Param('id', IntPipe) id: number,
        @Body() updateUserBody: usersZod.UpdateUserBody,
        @MustAuthPayload() tokenPayload: TokenPayload,
    ) {
        await this.userAuthz.canUpdateUserProfile(tokenPayload, id);

        const user = await this.userService.updateUserProfile({
            id: id,
            name: updateUserBody.name,
            email: updateUserBody.email,
        });

        return newUserResponse(user);
    }
}
