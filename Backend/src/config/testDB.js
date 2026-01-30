import pool from "db.js";

try {
  const [rows] = await pool.query("SELECT 1");
  console.log("✅ DB is working:", rows);
} catch (error) {
  console.error("❌ DB error:", error);
}