import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:XxEUju6vlr9g@ep-sweet-wildflower-a5s2uyn8.us-east-2.aws.neon.tech/neondb?sslmode=require",
);
export const db = drizzle(sql, { schema });
