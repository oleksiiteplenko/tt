# Time Tracker CLI for Projects

A simple command-line interface (CLI) tool to track time spent on projects and tasks. Manage multiple projects, track sessions, and view summaries — all from the terminal.

## Install

#### Prerequisites
You should [install Bun](https://bun.sh/docs/installation) first.

#### Install the CLI:
```
bun add -g @oleksiiteplenko/tt
```
#### Create DB:
Go to package folder:
```
cd ~/.bun/install/global/node_modules/@oleksiiteplenko/tt/
```
Run migration:
```
bunx --bun drizzle-kit push
```

## Usage
#### Start Tracking Time
```
tt start
```
This will prompt you to create a new project or select an existing one and add a task.

#### End Tracking Session
```
tt stop
```

#### List Projects
```
tt ls
```
#### List Tasks for a Project
```
tt ls -p <projectId>
```
#### For more commands
```
tt -h
tt [command] -h
```
