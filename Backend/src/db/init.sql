/* ================================
   PROJECT & TASK MANAGEMENT SYSTEM
   Database Schema
   MySQL 8+
================================ */

-- -- 1. Create Database
-- CREATE DATABASE IF NOT EXISTS project_task_management
-- CHARACTER SET utf8mb4
-- COLLATE utf8mb4_unicode_ci;

-- USE project_task_management;

-- ================================
-- 2. Roles Table
-- ================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('Admin', 'System administrator'),
('Project Manager', 'Manages projects and tasks'),
('Team Member', 'Works on assigned tasks');

-- ================================
-- 3. Users Table
-- ================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ================================
-- 4. Teams Table
-- ================================
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO teams (name, description) VALUES
('Backend Development Team', 'Handles server-side logic'),
('Frontend Web Development Team', 'Handles web UI'),
('Mobile Application Development Team', 'Handles mobile apps'),
('UI/UX Design Team', 'Handles design and user experience');

-- ================================
-- 5. Team Members Table
-- ================================
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_team_members_team
        FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_team_members_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (team_id, user_id)
);

-- ================================
-- 6. Projects Table
-- ================================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('planned', 'active', 'completed') DEFAULT 'planned',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_creator
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ================================
-- 7. Project Teams Table
-- ================================
CREATE TABLE project_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    team_id INT NOT NULL,

    CONSTRAINT fk_project_teams_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_teams_team
        FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE,

    UNIQUE (project_id, team_id)
);

-- ================================
-- 8. Tasks Table
-- ================================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    assigned_to INT NOT NULL,
    assigned_by INT NOT NULL,
    status ENUM('not_started', 'started', 'completed') DEFAULT 'not_started',
    progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    start_date DATE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_assigned_to
        FOREIGN KEY (assigned_to) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tasks_assigned_by
        FOREIGN KEY (assigned_by) REFERENCES users(id)
        ON DELETE RESTRICT
);

-- ================================
-- 9. Task Progress History Table
-- ================================
CREATE TABLE task_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    updated_by INT NOT NULL,
    status ENUM('not_started', 'started', 'completed') NOT NULL,
    progress INT NOT NULL CHECK (progress BETWEEN 0 AND 100),
    comment VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_progress_task
        FOREIGN KEY (task_id) REFERENCES tasks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_task_progress_user
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON DELETE RESTRICT
);

-- ================================
-- DONE ✅
-- ================================
