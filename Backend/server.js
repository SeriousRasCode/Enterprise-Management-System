import pool from "./src/config/db.js";
import express from "express";
import dotenv from "dotenv";
import createTables from "./src/db/create-table.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3333;


app.get("/", (req, res) => {
    res.send("Welcome to the Project and Task Management API");
});

// Initialize database tables
createTables(); 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});