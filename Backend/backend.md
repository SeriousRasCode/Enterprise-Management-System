# Backend API Documentation

The backend service powers the Enterprise Management System and exposes the core business logic for authentication, projects, tasks, teams, reports, notifications, and administrative operations.

## Overview

This API is built with Node.js and Express.js and communicates with a MySQL database. It provides a RESTful interface for the mobile application and any future web or admin clients.

## Key Capabilities

- User registration and login
- JWT-based authentication and authorization
- Role-based access control
- Project and phase management
- Task and subtask management
- Assignment tracking
- Comments and file attachments
- Reports, dashboards, and activity logs
- Notifications and email integration
- OpenAPI-based API documentation via Swagger

## Tech Stack

- Node.js
- Express.js
- MySQL2
- JWT
- Multer
- Nodemailer
- Swagger UI
- dotenv
- CORS
- rate limiting

## Project Structure

```text
Backend/
├── src/
│   ├── config/
│   ├── controller/
│   ├── db/
│   ├── docs/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   └── utils/
├── app.js
├── server.js
├── package.json
└── .env
```

## Main Features by Module

### Authentication

- Login, registration, and password-related flows
- Token-based user verification
- Secure access to protected resources

### User Management

- Create and manage users
- View and update user records
- Support role-based access

### Team Management

- Create and maintain teams
- Assign users to teams
- Organize workforce by department or project group

### Project and Phase Management

- Manage project lifecycle data
- Track phases and related deliverables
- Support project-level organization

### Task Management

- Create, assign, update, and monitor tasks
- Support subtasks and task comments
- Monitor progress and completion status

### Reporting and Dashboard

- Activity tracking
- Operational summary dashboards
- Reporting endpoints for decision-making

## Environment Variables

Create a `.env` file in the `Backend` folder:

```env
PORT=3333
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=enterprise_management_system
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

## Installation

```bash
cd Backend
npm install
```

## Run the Server

```bash
node server.js
```

The API will start on the default port:

```text
http://localhost:3333
```

## API Documentation

Swagger documentation is mounted in the project and can be accessed at:

```text
http://localhost:3333/api/docs
```

## Common Routes

- `/api/auth` - authentication endpoints
- `/api/users` - user operations
- `/api/teams` - team management
- `/api/projects` - project management
- `/api/tasks` - task operations
- `/api/subtasks` - subtask operations
- `/api/reports` - reports and analytics
- `/api/dashboard` - dashboard information
- `/api/notifications` - notifications
- `/api/attachments` - file attachments

## Security Notes

- Use strong JWT secrets in production
- Restrict database credentials and environment access
- Enable HTTPS in production deployments
- Apply validation and sanitization for all user inputs
- Use secure email and storage configuration

## Deployment Guidance

For production deployment, ensure:

- a managed MySQL instance is configured
- environment variables are stored securely
- API traffic is protected behind a reverse proxy
- logs and monitoring are enabled
- rate limiting and request validation remain active

## Contributor Notes

This API is organized around modular routes, controllers, and models for maintainability. Each business domain is separated into focused files and folders, which makes scaling features and onboarding developers easier.
