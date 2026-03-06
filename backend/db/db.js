import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
};

export default pool;