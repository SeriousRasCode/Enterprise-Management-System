import mysql from 'mysql2/promise';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/**
 * Pool WITHOUT database (setup only)
 */
const setupPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 5
});

/**
 * ================= DATABASE SETUP ENDPOINT =================
 */
app.get('/api/setup-database', async (req, res) => {
    let connection;

    try {
        connection = await setupPool.getConnection();
        await connection.beginTransaction();

        const DB_NAME = process.env.DB_NAME || 'enterprise_management_system';

        console.log('🚀 Starting database setup...');

        /* ================= DATABASE ================= */
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        await connection.query(`USE \`${DB_NAME}\``);

        /* ================= ROLES ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                description VARCHAR(255)
            )
        `);

        await connection.query(`
            CREATE UNIQUE INDEX idx_roles_name ON roles(name)
        `);

        /* ================= USERS ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            )
        `);

        await connection.query(`
            CREATE UNIQUE INDEX idx_users_email ON users(email)
        `);

        /* ================= USER ROLES ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_roles (
                user_id INT NOT NULL,
                role_id INT NOT NULL,
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE INDEX idx_user_roles_user_id ON user_roles(user_id)
        `);
        await connection.query(`
            CREATE INDEX idx_user_roles_role_id ON user_roles(role_id)
        `);

        /* ================= TEAMS ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE INDEX idx_teams_created_by ON teams(created_by)
        `);

        /* ================= TEAM MEMBERS ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS team_members (
                team_id INT NOT NULL,
                user_id INT NOT NULL,
                PRIMARY KEY (team_id, user_id),
                FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE INDEX idx_team_members_team_id ON team_members(team_id)
        `);
        await connection.query(`
            CREATE INDEX idx_team_members_user_id ON team_members(user_id)
        `);

        /* ================= PROJECTS ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                team_id INT NOT NULL,
                manager_id INT NOT NULL,
                start_date DATE,
                end_date DATE,
                status ENUM('planned','active','completed','on_hold') DEFAULT 'planned',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (team_id) REFERENCES teams(id),
                FOREIGN KEY (manager_id) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE INDEX idx_projects_team_id ON projects(team_id)
        `);
        await connection.query(`
            CREATE INDEX idx_projects_manager_id ON projects(manager_id)
        `);
        await connection.query(`
            CREATE INDEX idx_projects_status ON projects(status)
        `);

        /* ================= TASKS ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                title VARCHAR(150) NOT NULL,
                description TEXT,
                start_date DATE,
                due_date DATE,
                status ENUM('not_started','started','completed') DEFAULT 'not_started',
                progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE INDEX idx_tasks_project_id ON tasks(project_id)
        `);
        await connection.query(`
            CREATE INDEX idx_tasks_status ON tasks(status)
        `);
        await connection.query(`
            CREATE INDEX idx_tasks_due_date ON tasks(due_date)
        `);

        /* ================= TASK ASSIGNMENTS ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS task_assignments (
                task_id INT NOT NULL,
                user_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (task_id, user_id),
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id)
        `);
        await connection.query(`
            CREATE INDEX idx_task_assignments_user_id ON task_assignments(user_id)
        `);

        /* ================= TASK UPDATES ================= */
        await connection.query(`
            CREATE TABLE IF NOT EXISTS task_updates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT NOT NULL,
                user_id INT NOT NULL,
                progress_percentage INT NOT NULL CHECK (progress_percentage BETWEEN 0 AND 100),
                status ENUM('started','completed') NOT NULL,
                update_note TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE INDEX idx_task_updates_task_id ON task_updates(task_id)
        `);
        await connection.query(`
            CREATE INDEX idx_task_updates_user_id ON task_updates(user_id)
        `);
        await connection.query(`
            CREATE INDEX idx_task_updates_updated_at ON task_updates(updated_at)
        `);

        await connection.commit();

        console.log('✅ Database setup completed successfully');

        res.json({
            success: true,
            message: 'Database setup completed successfully',
            database: DB_NAME
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('❌ Setup failed:', error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

// Before running this endpoint, you can uncomment and run the following SQL to insert default roles:
// INSERT INTO roles (name, description) VALUES
// ('Admin', 'System Administrator'),
// ('Manager', 'Project Manager'),
// ('Member', 'Team Member');

// Similarly, you can insert a default user and a team for testing purposes:
// INSERT INTO teams (name, created_by)
// VALUES ('Backend Team', 1);
