import { type Command } from 'commander';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../repositories/taskRepository';
import { printTable } from '../utils/printTable';

export function createTaskCommand(program: Command) {
  const task = program
    .command('task')
    .alias('t')
    .description('Create/Update/Delete Task');

  task
    .command('list')
    .alias('ls')
    .description('Show list of tasks')
    .argument('<projectId>', 'ID of the project')
    .action(async (projectId) => {
      const tasks = await getTasks(projectId);

      if (tasks.length) {
        console.log('📋 There are the tasks for the project:');

        const rows = tasks.map(({ id, name }) => [
          id,
          name,
        ]);
        printTable({ headers: ['ID', 'Name'], rows });
      } else {
        console.log('🙈 No tasks found');
      }
    });

  task
    .command('create')
    .description('Create a new tasks')
    .argument('<projectId>', 'ID of the project')
    .argument('<name>', 'Name of the task')
    .action(async (projectId, name) => {
      await createTask(projectId, name);
      console.log('🥳 Task created: ', name);
    });

  task
    .command('update')
    .description('Update the tasks')
    .argument('<id>', 'ID of the task')
    .argument('<name>', 'New name for the task')
    .action(async (id, name) => {
      await updateTask(id, name);
      console.log('💅 Task updated');
    });

  task
    .command('delete')
    .description('Delete the tasks')
    .argument('<id>', 'ID of the task')
    .action(async (id) => {
      const result = await deleteTask(id);

      if (result.length) {
        const [{ name }] = result;
        console.log(`🗑️ Task "${name}" deleted`);
      } else {
        console.log('🙈 There is no such a task');
      }
    });
}
