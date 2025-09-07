import { TokenPayload } from '../domain/auth';
import { ITokenPort, ITokenVerifyService } from '../port/auth.port';

export default class TokenVerifyService implements ITokenVerifyService {
    constructor(private tokenAdapter: ITokenPort) {}

    verifyToken(token: string): TokenPayload {
        return this.verifyToken(token);
    }
}
