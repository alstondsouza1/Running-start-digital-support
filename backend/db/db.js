import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
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