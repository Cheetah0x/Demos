import "./app/lib/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "app/lib/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL! + "",
  },
  verbose: true,
  strict: true,
});
