import { Pool } from "pg";
import "dotenv/config";
const config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
};
export const pool = new Pool(config);
