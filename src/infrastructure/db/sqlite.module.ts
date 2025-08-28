import { Module } from '@nestjs/common';
import * as schema from './schema';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { ConfigService } from '@nestjs/config';

export const DB_PROVIDER_NAME = Symbol('DB');

export type SQLiteDB = LibSQLDatabase<typeof schema>;

@Module({
    providers: [
        {
            provide: DB_PROVIDER_NAME,
            useFactory(conf: ConfigService) {
                const db = drizzle(conf.get<string>('DB_FILE_NAME')!, {
                    schema,
                });
                return db;
            },
            inject: [ConfigService],
        },
    ],
    exports: [DB_PROVIDER_NAME],
})
export class SqliteModule {}
