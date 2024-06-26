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
    //projectName: text("projectName").notNull.unique(),
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
//gonna have to rethink the whole db design

//make the project have to be unique for the linking, will
//have to be a pop up that says if a username has already been taken
//hopefully that will migrate easily

//contributions that are linked to the project
//does the primarykey have to ve the id
//linked to the FID? or linked to the projectName -

//do i put in the ethAddy
//see if contIdIdx makes sense
//store the eth address that the project is using
export const contributions = pgTable(
  "contributions",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    contribution: text("contribution").notNull().unique(),
    desc: text("desc").notNull(),
    //figure out why this is erroring
    link: text("link").notNull(),
    ethAddress: text("ethAddress")
      .references(() => projects.ethAddress)
      .notNull(),
  },
  (contributions) => {
    return {
      contIdIdx: uniqueIndex("cont_user_fid_idx").on(contributions.id),
    };
  }
);

//need to make a table for the contributions

//table for the attestations that are linked to the contribution
//this table will track the number of attestations to a contribution
//userFid tracked to see who made the attestation
//this will be the basic one to say that you liked a project
//track the type of attestation that they made
//will need to attest to the contributionID?
//attestation type will be what they thought about the project, "like", built with etc

export const contributionAttestations = pgTable(
  "contributionAttestations",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    contribution: text("contribution")
      .references(() => contributions.contribution)
      .notNull(),
    attestationUID: text("attestationUID").notNull(),
    attesterAddy: text("attesterAddy").notNull(),
    attestationType: text("attestationType").notNull(),
  },
  (contributionAttestations) => {
    return {
      contAttestIdIdx: uniqueIndex("cont_attest_id_idx").on(
        contributionAttestations.id
      ),
    };
  }
);

//stuff that is easy to count and see the value of
//this should do for now.
