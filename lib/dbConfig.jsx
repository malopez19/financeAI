import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:CqNId0ZYa2Um@ep-purple-waterfall-a84w0fr2.eastus2.azure.neon.tech/neondb?sslmode=require",
);
export const db = drizzle(sql, { schema });
