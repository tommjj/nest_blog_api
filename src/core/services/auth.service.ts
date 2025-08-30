import { IAuthService, IPasswordPort, ITokenPort } from '../port/auth.port';
import { IUsersRepository } from '../port/users.port';

import { errors } from '../domain/errors';
import { withError } from 'src/common/helper/withError';

export default class AuthService implements IAuthService {
    constructor(
        private userRepo: IUsersRepository,
        private tokenAdapter: ITokenPort,
        private hashAdapter: IPasswordPort,
    ) {}

    async authenticateUser(email: string, password: string): Promise<string> {
        const result = await withError(this.userRepo.getUserByEmail(email));
        if (!result.ok) {
            throw errors.InvalidCredentials();
        }
        const user = result.data;

        const isMatch = await this.hashAdapter.verify(user.password, password);
        if (!isMatch) {
            throw errors.InvalidCredentials();
        }

        return this.tokenAdapter.signToken({
            id: user.id,
            email: user.email,
            name: user.name,
        });
    }
}
