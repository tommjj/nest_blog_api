import { InferSelectModel } from 'drizzle-orm';
import * as schema from './schema';

export type UsersSchema = InferSelectModel<typeof schema.users>;
export type BlogsSchema = InferSelectModel<typeof schema.blogs>;
export type CommentsSchema = InferSelectModel<typeof schema.comments>;
