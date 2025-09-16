import { Module } from '@nestjs/common';

import { config } from '../utils/get_config.helper';

import * as schema from './schema';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { ConfigService } from '@nestjs/config';

export const DB_CLIENT = Symbol('DB');

export type SQLiteDB = LibSQLDatabase<typeof schema>;

@Module({
    providers: [
        {
            provide: DB_CLIENT,
            useFactory(conf: ConfigService) {
                const dbUrl = `file:${config(conf).mustString('DB_FILE_NAME')}`;

                const db = drizzle(dbUrl, {
                    schema,
                });
                return db;
            },
            inject: [ConfigService],
        },
    ],
    exports: [DB_CLIENT],
})
export class SqliteModule {}
