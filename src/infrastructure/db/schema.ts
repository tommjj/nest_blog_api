import { sql, relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamp = {
    createdAt: text('created_at')
        .notNull()
        .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
        .notNull()
        .default(sql`(datetime('now'))`)
        .$onUpdate(() => sql`(datetime('now'))`),
};

export const users = sqliteTable('users', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),

    ...timestamp,
});

export const blogs = sqliteTable('blogs', {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: int('author_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    ...timestamp,
});

/**
 * comments table
 * Schema:
 * - id: primary key
 * - content: text
 * - blogId: foreign key to blogs table
 * - authorId: foreign key to users table
 * - createdAt: timestamp
 * - updatedAt: timestamp
 */
export const comments = sqliteTable('comments', {
    id: int('id').primaryKey({ autoIncrement: true }),
    content: text('content').notNull(),
    blogId: int('blog_id')
        .notNull()
        .references(() => blogs.id, { onDelete: 'cascade' }),
    authorId: int('author_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    ...timestamp,
});

// Define relations for blogs
export const blogsRelations = relations(blogs, ({ many, one }) => ({
    comments: many(comments),
    author: one(users, {
        fields: [blogs.authorId],
        references: [users.id],
    }),
}));

// Define relations for users
export const usersRelations = relations(users, ({ many }) => ({
    blogs: many(blogs),
    comments: many(comments),
}));

// Define relations for comments
export const commentsRelations = relations(comments, ({ one }) => ({
    blog: one(blogs, {
        fields: [comments.blogId],
        references: [blogs.id],
    }),
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}));
