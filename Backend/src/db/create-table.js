import pool from "../config/db.js";

async function createTables(){
    try{
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=INNODB;
        `);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}

export default createTables;
