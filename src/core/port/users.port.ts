import { UserWithPassword, User } from '../domain/users';

export type CreateUser = Omit<
    UserWithPassword,
    'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateUser = Partial<CreateUser> & { id: number };

/**
 * IUsersRepository interface for user repository
 */
export interface IUsersRepository {
    /**
     * create a new user
     *
     * @param user - user to create
     * @returns created user with password
     * @throws DomainError if user creation fails
     */
    createUser(user: CreateUser): Promise<UserWithPassword>;
    /**
     * get user by id
     *
     * @param id - user id
     * @returns user with password
     * @throws DomainError if user not found
     */
    getUserById(id: number): Promise<UserWithPassword>;
    /**
     * get user by email
     *
     * @param email - user email
     * @returns user with password
     * @throws DomainError if user not found
     */
    getUserByEmail(email: string): Promise<UserWithPassword>;
    /**
     * update user
     *
     * @param user - user to update
     * @returns updated user with password
     * @throws DomainError if user update fails
     */
    updateUser(user: UpdateUser): Promise<UserWithPassword>;
    /**
     * delete user by id
     *
     * @param id - user id
     * @returns void
     * @throws DomainError if user deletion fails
     */
    deleteUser(id: number): Promise<void>;
}

export type UpdateUserWithoutPassword = Omit<UpdateUser, 'password'>;
export type UpdateUserPassword = {
    id: number;
    password: string;
};

/**
 * IUsersService interface for user service
 */
export interface IUsersService {
    /**
     * register a new user
     *
     * @param user - user to register
     * @returns registered user without password
     * @throws DomainError if registration fails
     */
    registerUser(user: CreateUser): Promise<User>;
    /**
     * get user profile
     *
     * @param id - user id
     * @returns user profile without password
     * @throws DomainError if user not found
     */
    getUserProfile(id: number): Promise<User>;
    /**
     * update user profile (without password)
     *
     * @param user - user to update (without password)
     * @returns updated user without password
     * @throws DomainError if update fails
     */
    updateUserProfile(user: UpdateUserWithoutPassword): Promise<User>;
    /**
     * update user password
     *
     * @param user - user to update (only id and new password)
     * @returns void
     * @throws DomainError if update fails
     */
    updateUserPassword(user: UpdateUserPassword): Promise<void>;
    /**
     *
     * @param id - user id
     * @throws DomainError if delete fails
     */
    deleteUserAccount(id: number): Promise<void>;
}
