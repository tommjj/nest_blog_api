export type Comments = {
    id: number; // Zero value indicates a new comment
    content: string;
    authorId: number;
    blogId: number;

    createdAt: Date;
    updatedAt: Date;
};
