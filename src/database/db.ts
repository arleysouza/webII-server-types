import type { PoolConfig } from "pg";
import dotenv from "dotenv";
import path from "path";
import pg from "pg";

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", "..", ".env"),
});

const config: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT || 5432),
};

const pool = new pg.Pool(config);

export = pool;
