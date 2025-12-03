// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts", // where tables will live
  out: "./drizzle", // where migration files will be generated
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgres://pokemon:pokemon@localhost:5432/pokedex",
  },
});
