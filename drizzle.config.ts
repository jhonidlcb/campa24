import { defineConfig } from "drizzle-kit";

const connectionString = "postgresql://neondb_owner:npg_0GZ3UQxPbkgh@ep-silent-art-acye9k4d-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || connectionString,
  },
});
