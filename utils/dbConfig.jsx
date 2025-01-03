import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://testapp_owner:vumjK0PqRyd9@ep-misty-rice-a5j3q6dd.us-east-2.aws.neon.tech/test?sslmode=require",
);
export const db = drizzle(sql, { schema });
