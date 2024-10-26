import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { projects, sessions } from '../schema';

export function getAllProjects() {
  return db.select().from(projects);
}

export function getAllProjectsInfo() {
  return db
  .select({
    id: projects.id,
    name: projects.name,
    createdAt: projects.createdAt,

    // Calculate total duration for all sessions in each project
    duration: sql<number>`SUM(${sessions.duration})`,
  })
  .from(projects)
  .leftJoin(sessions, sql`${projects.id} = ${sessions.projectId}`)
  .groupBy(projects.id);
}

export function getProjectsCount() {
  return db.$count(projects);
}

export function getProjectById(id: number) {
  return db.select().from(projects).where(eq(projects.id, id));
}

export function createProject(name: string) {
  return db.insert(projects).values({ name }).returning();
}

export function updateProject(id: number, name: string) {
  return db.update(projects).set({ name }).where(eq(projects.id, id));
}

export function deleteProject(id: number) {
  return db.delete(projects).where(eq(projects.id, id)).returning();
}
