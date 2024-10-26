import { type Command } from 'commander';
import {
  deleteSession,
  getSessionsByTaskId,
  updateSession,
  getSessionsById,
} from '../repositories/sessionRepository';
import { formatDuration, timeStringToSeconds } from '../utils/timeUtils';
import { printTable } from '../utils/printTable';
import { input } from '@inquirer/prompts';

export function createSessionCommand(program: Command) {
  const session = program
    .command('session')
    .alias('s')
    .description('Update/Delete Session');

  session
    .command('list')
    .alias('ls')
    .description('Show list of sessions')
    .requiredOption('-t <number>', 'Task ID')
    .action(async ({ t: taskId }) => {
      const list = await getSessionsByTaskId(taskId);

      if (list.length) {
        console.log('📋 Session for the task:');

        const rows = list.map(({ id, duration }) => [
          id,
          duration ? formatDuration(duration) : 'Running...',
        ]);
        printTable({ headers: ['ID', 'Duration'], rows });
      } else {
        console.log('🙈 No sessions found');
      }
    });

  session
    .command('update')
    .description('Update session')
    .argument('<id>', 'ID of the session')
    .action(async (id) => {
      const [session] = await getSessionsById(id);

      if (!session) {
        console.log('🙈 There is no such a session');
        return;
      }

      if (!session.duration) {
        console.log('❌ The session is not finished');
        return;
      }

      const durationStr = formatDuration(session.duration);
      const answer = await input({
        message: `Duration of this session is ${durationStr}. Enter a new value:`,
      });
      const newDuration = timeStringToSeconds(answer);
      const endDate = new Date(+session.createdAt + newDuration * 1000);
      await updateSession(id, endDate);
      console.log(
        `✅ Session updated. Duration changed from "${durationStr}" to "${answer}"`,
      );
    });

  session
    .command('delete')
    .description('Delete the sessions')
    .argument('<id>', 'ID of the session')
    .action(async (id) => {
      const result = await deleteSession(id);

      if (result.length) {
        console.log(`🗑️ Session with id: ${id} deleted`);
      } else {
        console.log('🙈 There is no such a session');
      }
    });
}
