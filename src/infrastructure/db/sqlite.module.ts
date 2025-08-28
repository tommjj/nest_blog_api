import { Module } from '@nestjs/common';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';

export const DB_PROVIDER_NAME = Symbol('DB');

const db = drizzle(process.env.DB_FILE_NAME!, {
    schema,
});
export type SQLiteDB = typeof db;

@Module({
    providers: [
        {
            provide: DB_PROVIDER_NAME,
            useValue: db,
        },
    ],
    exports: [DB_PROVIDER_NAME],
})
export class SqliteModule {}
