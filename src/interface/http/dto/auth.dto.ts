import { HTTPResponse, newSuccessResponse } from './response';

export type AuthResponse = {
    access_token: string;
};

export function newAuthResponse(token: string): HTTPResponse<AuthResponse> {
    return newSuccessResponse({
        access_token: token,
    });
}
