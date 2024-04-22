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
