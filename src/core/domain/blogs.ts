export type Blogs = {
    id: number; // Zero value indicates a new blog
    title: string;
    content: string;
    authorId: number;

    createdAt: Date;
    updatedAt: Date;
};

export type BlogInfo = Omit<Blogs, 'content'>;
