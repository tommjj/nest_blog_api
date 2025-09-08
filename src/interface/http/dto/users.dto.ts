import { User } from 'src/core/domain/users';
import { HTTPResponse, newSuccessResponse } from './response';

export type UserResponse = {
    id: number;
    name: string;
    email: string;
};

export function newUserResponse(user: User): HTTPResponse<UserResponse> {
    return newSuccessResponse({
        id: user.id,
        email: user.email,
        name: user.name,
    });
}
