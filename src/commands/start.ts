import { type Command } from 'commander';
import { confirm, input, select, Separator } from '@inquirer/prompts';
import { bold, green } from 'yoctocolors';
import {
  getRunningSession,
  startSession,
  stopSession,
} from '../repositories/sessionRepository';
import { createTask, getTasks } from '../repositories/taskRepository';
import {
  createProject,
  getAllProjects,
  getProjectById,
} from '../repositories/projectRepository';
import type { Project, Task } from '../schema';
// import { formatDate } from '../utils/timeUtils';

async function askCreateProject() {
  const answer = await input({
    message: 'Enter name for the project:',
  });

  const [project] = await createProject(answer);
  console.log(green(`🥳 Project "${project.name}" created!`));

  return project;
}

async function selectOrCreateProject(projects: Project[]) {
  const answer = await select({
    message: 'Select a project or create new:',
    choices: [
      ...projects.map(({ id, name }) => ({ value: id, name })),
      new Separator(),
      { value: null, name: 'Create a new project' },
    ],
  });

  if (answer === null) {
    return askCreateProject();
  }

  return projects.find(({ id }) => id === answer)!;
}

async function askCreateTask(project: Project) {
  const answer = await input({
    message: 'Enter name for the task:',
  });

  const [task] = await createTask(project.id, answer);
  console.log(green(`🥳 Task "${task.name}" created!`));

  return task;
}

async function selectOrCreateTask(tasks: Task[], project: Project) {
  const answer = await select({
    message: 'Select a task or create new:',
    choices: [
      ...tasks.map(({ id, name }) => ({ value: id, name })),
      new Separator(),
      { value: null, name: 'Create a new task' },
    ],
  });

  if (answer === null) {
    return askCreateTask(project);
  }

  return tasks.find(({ id }) => id === answer)!;
}

export function createStartCommand(program: Command) {
  program
    .command('start')
    .description('Start working on a project')
    .action(async () => {
      // If there is a running session we should stop it first
      const [runningSession] = await getRunningSession();
      if (runningSession) {
        const [{ name }] = await getProjectById(runningSession.projectId);
        const shouldStopFirst = await confirm({
          message: `There is the running session in "${name}" project right now. Do you want to finish it?`,
          default: false,
        });

        if (shouldStopFirst) {
          await stopSession(runningSession.id);
        } else {
          // do nothing if the session continue running
          return;
        }
      }

      // Project
      const projects = await getAllProjects();
      let project: Project;
      if (projects.length) {
        project = await selectOrCreateProject(projects);
      } else {
        console.log('😳 There is no projects yet. Let`s create one!');
        project = await askCreateProject();
      }

      // Task
      const tasks = await getTasks(project.id);
      let task: Task;
      if (tasks.length) {
        task = await selectOrCreateTask(tasks, project);
      } else {
        task = await askCreateTask(project);
      }

      // Session
      const shouldStart = await confirm({
        message: 'Do you want to start right now?',
      });
      if (shouldStart) {
        await startSession(project.id, task.id);
        console.log('🚀 GO GO GO!');
      } else {
        console.log(
          'You can create more tasks with:',
          bold('tt task create <projectId> <name>'),
        );
        console.log('To start:', bold('tt start'));
      }
    });
}
