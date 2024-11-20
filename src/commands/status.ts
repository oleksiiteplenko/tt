import { type Command } from 'commander';
import { getRunningSession } from '../repositories/sessionRepository';
import { bold } from 'yoctocolors';
import { formatDuration } from '../utils/timeUtils';

export function createStatusCommand(program: Command) {
  program
    .command('status')
    .alias('st')
    .description('Check if there is a running session')
    .action(async () => {
      const [runningSession] = await getRunningSession();
      if (runningSession) {
        const { projectName, taskName, createdAt } = runningSession;

        const duration = formatDuration((Date.now() - +createdAt) / 1000);

        console.log(
          `⏳There is a running session in project "${bold(
            projectName,
          )}" on task "${bold(taskName)}"`,
        );
        console.log(`⏱️ Duration: ${bold(duration)}`);
        console.log(`To stop the session run: ${bold('tt stop')}`);
      } else {
        console.log('😳 There is no running sessions');
        console.log('To start new one run:', bold('tt start'));
      }
    });
}
