import { type Command } from 'commander';
import { bold } from 'yoctocolors';
import { getTasksInfo } from '../repositories/taskRepository';
import { getAllProjectsInfo } from '../repositories/projectRepository';
import { formatDuration } from '../utils/timeUtils';
import { printTable } from '../utils/printTable';

export function createListCommand(program: Command) {
  const list = program
    .command('list')
    .alias('ls')
    .description('Show list of projects/tasks')
    .option('-p, --project <number>', 'ID of the project')
    .action(async ({ project }) => {
      if (project) {
        const tasks = await getTasksInfo(project);

        if (tasks.length) {
          console.log('📋 There are the tasks for the project:');

          const rows = tasks.map(({ id, name, duration }) => [id, name, formatDuration(duration)]);
          printTable({ headers: ['ID', 'Name', 'Time spent'], rows });

          return;
        }

        console.log(
          '🙈 There are no tasks for the project. To create a task:',
          bold('tt task create'),
        );
        return;
      }

      const projectsInfo = await getAllProjectsInfo();

      if (projectsInfo.length === 0) {
        console.log(
          '👻 There are no projects yet. To create a project:',
          bold('tt project create -n "My gorgeous project"'),
        );
        return;
      }

      const rows = projectsInfo.map(({ id, name, duration }) => [id, name, formatDuration(duration)]);
      console.log('📋 Your projects:');
      printTable({ headers: ['ID', 'Name', 'Time spent'], rows });
    });
}
