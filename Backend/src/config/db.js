import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a pool for better performance
const pool = mysql.createPool({
    host: "localhost" ,
    user: "root" ,   
    password: '',  
    database: "enterprise_management_system",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection (optional)
(async () => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        console.log("✅ Database connected successfully, test result:", rows[0].result);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
})();

export default pool;
