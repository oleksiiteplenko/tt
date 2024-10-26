import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { sessions, tasks } from '../schema';

export function getTasks(projectId: number) {
  return db.select().from(tasks).where(eq(tasks.projectId, projectId));
}

export function getTasksInfo(projectId: number) {
  return db
  .select({
    id: tasks.id,
    name: tasks.name,

    // Calculate total duration for each task
    duration: sql<number>`SUM(${sessions.duration})`,
  })
  .from(tasks)
  .leftJoin(sessions, sql`${tasks.id} = ${sessions.taskId}`)
  .where(sql`${tasks.projectId} = ${projectId}`)
  .groupBy(tasks.id);
}

export function createTask(projectId: number, name: string) {
  return db.insert(tasks).values({ projectId, name }).returning();
}

export function updateTask(id: number, name: string) {
  return db.update(tasks).set({ name }).where(eq(tasks.id, id));
}

export function deleteTask(id: number) {
  return db.delete(tasks).where(eq(tasks.id, id)).returning();
}
