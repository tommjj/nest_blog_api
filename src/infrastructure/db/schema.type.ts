import { InferSelectModel } from 'drizzle-orm';
import * as schema from './schema';

export type UsersSchema = InferSelectModel<typeof schema.users>;
export type PostsSchema = InferSelectModel<typeof schema.posts>;
export type CommentsSchema = InferSelectModel<typeof schema.comments>;
