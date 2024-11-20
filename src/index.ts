#! /usr/bin/env bun
import { program } from 'commander';
import { name, description, version } from '../package.json';
import { createProjectCommand } from './commands/project';
import { createTaskCommand } from './commands/task';
import { createSessionCommand } from './commands/session';
import { createStartCommand } from './commands/start';
import { createListCommand } from './commands/list';
import { createStopCommand } from './commands/stop';
import { createStatusCommand } from './commands/status';

program
  .name(name.split('/')[1])
  .description(description)
  .version(version, '-v --version');

createStartCommand(program);
createStopCommand(program);
createListCommand(program);
createProjectCommand(program);
createTaskCommand(program);
createSessionCommand(program);
createStatusCommand(program);

await program.parseAsync();
