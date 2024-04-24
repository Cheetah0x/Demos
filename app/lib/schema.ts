import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { useGlobalState } from "config/config";

//to add columns to the schema you can add them in as usual then
//run yarn drizzle-kit push:pg, it will add the columns to the database
//useful for prototyping
//when there is more data use the migrations

//This is the schema for the users that login to use the app
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    fid: text("fid").notNull().unique(),
    username: text("username").notNull(),
    ethaddress: text("ethaddress"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("fid_unique_idx").on(users.fid),
    };
  }
);

//this is the projects table for AttestDb Demo

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    ethAddress: text("ethAddress").notNull(),
    projectName: text("projectName").notNull(),
    websiteUrl: text("websiteUrl"),
    twitterUrl: text("twitterUrl"),
    githubUrl: text("githubUrl"),
    logoUrl: text("logoUrl"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (projects) => {
    return {
      userIdIdx: uniqueIndex("projects_user_id_idx").on(projects.id),
    };
  }
);
