import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/libsql';

const DB_PROVIDER_NAME = 'DB';
const db = drizzle(process.env.DB_FILE_NAME!);

@Module({
    providers: [
        {
            provide: DB_PROVIDER_NAME,
            useValue: db,
        },
    ],
    exports: [DB_PROVIDER_NAME],
})
export class SQLiteModule {}
