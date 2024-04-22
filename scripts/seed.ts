import { NewUser, insertUser } from "../lib/db";

async function main() {
  const newUser: NewUser = {
    fid: "1",
    username: "boohoo",
    ethaddress: "0x1234",
  };
  const res = await insertUser(newUser);
  console.log("insert user success", res);
  process.exit();
}

main();
