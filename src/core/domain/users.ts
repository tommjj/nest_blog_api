export type User = {
    id: number; // Zero value indicates a new user
    name: string;
    email: string;

    createdAt: Date;
    updatedAt: Date;
};

export type UserWithPassword = User & {
    password: string;
    isHashed: boolean;
};
