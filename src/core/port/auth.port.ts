import { TokenPayload } from '../domain/auth';

export interface IPasswordPort {
    /**
     * get algorithm name
     *
     * @returns return algorithm name
     */
    algorithm(): string;

    /**
     * hash
     *
     * @returns return hashed password
     */
    hash(password: string): Promise<string>;

    /**
     * verify
     *
     * @param hashedPassword - hashed password
     * @param password - password
     */
    verify(hashedPassword: string, password: string): Promise<boolean>;
}

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

export interface ITokenVerifyService {
    /**
     * verify token
     *
     * @param token - token
     * @returns return token payload
     * @throws DomainError if token invalid
     */
    verifyToken(token: string): TokenPayload;
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
