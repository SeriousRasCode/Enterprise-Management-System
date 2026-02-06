import dotenv from "dotenv";
import pool from "./src/config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3333;

// test endpoint
app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() AS current_time");
        res.json({
            message: "Welcome to the Project and Task Management API",
            db_time: rows[0].current_time
        });z
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});