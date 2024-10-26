import { join } from "path";

const timestamp = Date.now();

const { dir } = import.meta;
const file = Bun.file(join(dir, "../../db/sqlite/tt.db"));
await Bun.write(join(dir, `../../db/backups/${timestamp}.tt.db`), file);

console.log('Backup complete: ', new Date(timestamp));
