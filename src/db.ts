import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import dbPath from './utils/dbPath';

const sqlite = new Database(dbPath);

sqlite.run('PRAGMA foreign_keys = ON');

export const db = drizzle(sqlite);
