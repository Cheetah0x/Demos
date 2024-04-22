import { insertUser } from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

interface NewUser {
  fid: string;
  username: string;
  ethaddress?: string;
  id?: number;
  createdAt?: Date;
}

export const POST = async (request: Request) => {
  try {
    const newUser: NewUser = await request.json();

    //insert user into database
    const insertedUser = await insertUser(newUser);
    return NextResponse.json(insertedUser, { status: 200 });
  } catch (error) {
    console.error("Error inserting user", error);
    return NextResponse.json(
      { error: "Failed to insert user" },
      { status: 500 }
    );
  }
};
