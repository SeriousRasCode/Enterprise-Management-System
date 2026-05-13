// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// const config = dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST ,
//     port: parseInt(process.env.DB_PORT) ,
//     user: process.env.DB_USER  ,
//     password: process.env.DB_PASSWORD , 
//     database: process.env.DB_NAME ,
//     waitForConnections: true,
//     connectionLimit: 10,
//     maxIdle: 10, 
//     idleTimeout: 60000, 
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0,
//     ssl: {
//         rejectUnauthorized: false 
//     }
// });

// local version

// // Test the connection on startup
// try {
//     const connection = await pool.getConnection();
//     console.log('✅ Connected to Aiven MySQL Pool successfully!');
//     connection.release(); 
// } catch (err) {
//     console.error('❌ Database connection failed:', err.message);
// }
// export default pool;



import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a pool for better performance
const pool = mysql.createPool({
    host: "localhost" ,
    user: "root" ,
    password: '',
    database: "ptms",
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