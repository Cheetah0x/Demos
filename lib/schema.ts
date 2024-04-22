import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { useGlobalState } from "config/config";

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
