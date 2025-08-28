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
