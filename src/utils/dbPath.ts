import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync } from 'fs';

function getDBPath() {
  const pathFromEnv = process.env.DB_PATH;

  if (pathFromEnv) {
    return pathFromEnv;
  } else {
    const dbPath = join(homedir(), '.tt', 'tt.db');
    mkdirSync(join(homedir(), '.tt'), { recursive: true });

    return dbPath;
  }
}

export const dbPath = getDBPath();
