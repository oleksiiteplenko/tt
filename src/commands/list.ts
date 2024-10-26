import { type Command } from 'commander';
import { bold } from 'yoctocolors';
import Table from 'cli-table3';
import { getTasksInfo } from '../repositories/taskRepository';
import { getAllProjectsInfo } from '../repositories/projectRepository';
import { formatDuration } from '../utils/timeUtils';

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
          const table = new Table({ head: ['ID', 'Name', 'Duration'], style: { head: ['blue'] } });
          tasks.forEach(({ id, name, duration }) => {
            table.push([id, name, formatDuration(duration)]);
          });

          console.log('📋 There are the tasks for the project:');
          console.log(table.toString());
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

      const table = new Table({ head: ['ID', 'Name', 'Duration'], style: { head: ['blue'] } });
      projectsInfo.forEach(({ id, name, duration }) => {
        table.push([id, name, formatDuration(duration)]);
      });

      console.log('📋 Your projects:');
      console.log(table.toString());
    });
}
