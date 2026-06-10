import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required database environment variable: ${key}`);
  }
}

const parsedPort = Number(process.env.DB_PORT || 3306);

if (Number.isNaN(parsedPort)) {
  throw new Error("DB_PORT must be a valid number");
}

const useSsl = process.env.DB_SSL === "true";

const poolConfig = {
  host: process.env.DB_HOST,
  port: parsedPort,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (useSsl) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
  };
}

const pool = mysql.createPool(poolConfig);

export async function testConnection() {
  const connection = await pool.getConnection();
  console.log("MySQL Connected Successfully");
  connection.release();
}

export async function checkDatabaseHealth() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows?.[0]?.ok === 1;
}

export default pool;
