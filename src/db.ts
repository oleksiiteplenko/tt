import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database('db/sqlite/tt.db');

sqlite.run('PRAGMA foreign_keys = ON');

export const db = drizzle(sqlite);
