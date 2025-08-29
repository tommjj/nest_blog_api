import { TokenPayload } from '../domain/auth';

export interface ITokenPort {
    /**
     * verify token
     *
     * @param token - token
     * @returns return token payload
     * @throws DomainError if token invalid
     */
    verifyToken(token: string): TokenPayload;
    /**
     * sign token
     *
     * @param payload - token payload
     * @returns return - token
     */
    signToken(payload: TokenPayload): string;
}

export interface IAuthService {
    /**
     * authenticate a user
     *
     * @param email - user email
     * @param password - user password
     * @returns return access token
     * @throws DomainError if authentication fails
     */
    authenticateUser(email: string, password: string): Promise<string>;
}
