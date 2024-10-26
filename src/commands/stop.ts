import { type Command } from 'commander';
import { getRunningSession, stopSession } from '../repositories/sessionRepository';
import { green } from 'yoctocolors';

export function createStopCommand(program: Command) {
  program
    .command('stop')
    .description('Stop working on a project')
    .action(async () => {
      const [runningSession] = await getRunningSession();
      if (runningSession) {
        await stopSession(runningSession.id);
        console.log(green('🌴 Session stopped.'));
      } else {
        console.log('😳 There is no running sessions');
      }
    });
}
