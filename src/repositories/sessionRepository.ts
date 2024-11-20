import { eq, sql, isNull } from 'drizzle-orm';
import { db } from '../db';
import { projects, sessions, tasks } from '../schema';

export function getSessionsById(id: number) {
  return db.select().from(sessions).where(eq(sessions.id, id));
}

export function getSessionsByTaskId(taskId: number) {
  return db.select().from(sessions).where(eq(sessions.taskId, taskId));
}

export function getRunningSession() {
  return db
    .select({
      id: sessions.id,
      projectId: sessions.projectId,
      createdAt: sessions.createdAt,
      projectName: projects.name,
      taskName: tasks.name
    })
    .from(sessions)
    .innerJoin(projects, eq(projects.id, sessions.projectId))
    .innerJoin(tasks, eq(tasks.id, sessions.taskId))
    .where(isNull(sessions.finishedAt));
}

export function startSession(projectId: number, taskId: number) {
  return db.insert(sessions).values({ projectId, taskId });
}

export function stopSession(sessionId: number) {
  return db.update(sessions).set({ finishedAt: sql`(unixepoch())` }).where(eq(sessions.id, sessionId));
}

export function updateSession(id: number, finishedAt: Date) {
  return db.update(sessions).set({ finishedAt }).where(eq(sessions.id, id));
}

export function deleteSession(id: number) {
  return db.delete(sessions).where(eq(sessions.id, id)).returning();
}
