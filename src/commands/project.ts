import { type Command } from 'commander';
import { createProject, deleteProject, updateProject } from '../repositories/projectRepository';

export function createProjectCommand(program: Command) {
  const project = program
    .command('project')
    .alias('p')
    .description('Create/Update/Delete Project');

  project
    .command('create')
    .description('Create a new projects')
    .requiredOption('-n --name <string>', 'Name of the project')
    .action(async ({ name }) => {
      await createProject(name);
      console.log('🥳 Project created: ', name);
    });

  project
    .command('update')
    .description('Update the projects')
    .argument('<id>', 'ID of the project')
    .requiredOption('-n, --name <string>', 'New name for the project')
    .action(async (id, { name }) => {
      await updateProject(id, name);
      console.log('💅 Project updated.');
    });

  project
    .command('delete')
    .description('Delete the projects')
    .argument('<id>', 'ID of the project')
    .action(async (id) => {
      const result = await deleteProject(id);

      if (result.length) {
        const [{ name }] = result;
        console.log(`🗑️ Project "${name}" deleted`);
      } else {
        console.log('🙈 There is no such a project');
      }
    });
}
