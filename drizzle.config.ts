import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/infrastructure/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: `file:${process.env.DB_FILE_NAME!}`,
    },
});
