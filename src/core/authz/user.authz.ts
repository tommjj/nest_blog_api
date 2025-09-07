/* eslint-disable @typescript-eslint/require-await */
import { TokenPayload } from '../domain/auth';
import { errors } from '../domain/errors';
import { IUsersAuthz } from '../port/users.port';

export class UserAuthz implements IUsersAuthz {
    async canRegisterUser(): Promise<void> {
        return;
    }

    async canGetUserProfile(): Promise<void> {
        return;
    }

    async canUpdateUserProfile(
        token: TokenPayload | undefined,
        id: number,
    ): Promise<void> {
        if (!token) {
            throw errors.Unauthorized();
        }

        if (id !== token.id) {
            throw errors.Forbidden();
        }
    }

    async canDeleteUserAccount(
        token: TokenPayload | undefined,
        id: number,
    ): Promise<void> {
        if (!token) {
            throw errors.Unauthorized();
        }

        if (id !== token.id) {
            throw errors.Forbidden();
        }
    }
}
