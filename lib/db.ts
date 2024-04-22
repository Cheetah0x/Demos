import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { users, projects } from "./schema";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const getUsers = async () => {
  try {
    const selectResult = await db.select().from(users);
    console.log("Results", selectResult);
    return selectResult;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

//for the users table
export type NewUser = typeof users.$inferInsert;

export const insertUser = async (user: NewUser) => {
  try {
    return db.insert(users).values(user).returning();
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

export const getUsers2 = async () => {
  try {
    const result = await db.query.users.findMany();
    return result;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

//for the projects table
export type NewProject = typeof projects.$inferInsert;

export const getProjects = async () => {
  try {
    const selectResult = await db.select().from(projects);
    console.log("Results", selectResult);
    return selectResult;
  } catch (error) {
    console.error("Error retrieving projects:", error);
    throw error;
  }
};

export const insertProject = async (project: NewProject) => {
  try {
    return db.insert(projects).values(project).returning();
  } catch (error) {
    console.error("Error inserting project:", error);
    throw error;
  }
};
