import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_0GZ3UQxPbkgh@ep-silent-art-acye9k4d-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || connectionString 
});
export const db = drizzle(pool, { schema });