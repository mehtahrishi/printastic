import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema";

// Create the connection pool
const connectionInfo = process.env.DATABASE_URL!;

// Maintain a global connection in development to prevent too many connections
const globalForDb = globalThis as unknown as {
    conn: Awaited<ReturnType<typeof mysql.createPool>> | undefined;
};

const conn = globalForDb.conn ?? mysql.createPool(connectionInfo);

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema, mode: "default" });
