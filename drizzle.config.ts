import { defineConfig } from 'drizzle-kit';
import { dbPath } from './src/utils/dbPath';

export default defineConfig({
  out: './drizzle',
  schema: './src/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbPath,
  },
});
