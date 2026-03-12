import pool from "./src/config/db.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 3333;
// test endpoint
app.get("/api", async (req, res) => {
  try {
    res.json({
      message: "Welcome to the Project and Task Management API",
    });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});