# 🚀 Enterprise Management System

A full-stack enterprise platform for managing projects, tasks, teams, reports, notifications, and user access across an organization. The system is designed to centralize operational workflows, improve visibility, and support collaboration between administrators, project managers, and employees.

## 📌 Overview

The Enterprise Management System helps businesses:

- 👥 Manage users, teams, and roles
- 📁 Create and track projects through lifecycle stages
- ✅ Assign tasks and subtasks to team members
- 📊 Monitor progress with status updates and reporting
- 💬 Capture comments, attachments, and activity history
- 🔔 Send notifications and support operational reporting
- 🔐 Provide role-based access across different user groups

## ✨ Core Features

- 🛡️ Role-based authentication and authorization
- 🧑‍💼 Admin dashboard and user management
- 👥 Team and project management
- 🧩 Task and subtask assignment workflows
- 📈 Real-time progress tracking and milestone updates
- 🗂️ Commenting and file attachment support
- 📉 Dashboard analytics and reporting
- 🔔 Notification system for updates and reminders
- 🗄️ MySQL-backed persistence with structured API endpoints
- 📱 Mobile-first experience using Expo and React Native

## 🏗️ System Architecture

The project is split into two active application layers:

1. Backend API
   - Node.js
   - Express.js
   - MySQL
   - JWT authentication
   - Swagger/OpenAPI documentation

2. Mobile Client
   - Expo
   - React Native
   - React Navigation
   - Axios API integration

## 📁 Repository Structure

```text
Enterprise-Management-System/
├── Backend/                 # Core API server and business logic
│   ├── src/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── backend.md
├── Mobile/
│   └── deboApp/             # Expo mobile application
├── .gitignore
├── readme.md
├── Github.guidlines.html
└── Frontend/               # Local-only frontend copy for reference
```

## 🧰 Tech Stack

### Backend

- ⚙️ Node.js
- 🚀 Express.js
- 🗄️ MySQL2
- 🔐 JWT
- 📤 Multer
- 📧 Nodemailer / SendinBlue integration
- 📘 Swagger UI
- 🌐 CORS and rate-limiting support

### Mobile App

- 📱 Expo
- ⚛️ React Native
- 🧭 React Navigation
- 🌐 Axios
- 💾 AsyncStorage
- 🧠 Zustand for state management

## 👤 User Roles

| Role            | Responsibilities                                                |
| --------------- | --------------------------------------------------------------- |
| Admin           | Manage users, teams, permissions, and platform-level operations |
| Project Manager | Create and oversee projects, assign tasks, and monitor progress |
| Employee        | View assignments, update task progress, and collaborate on work |

## ✅ Prerequisites

Before running the project, ensure the following are installed:

- 🟢 Node.js 18+
- 📦 npm or yarn
- 🗄️ MySQL database
- 📱 Expo CLI for the mobile app
- 🧪 Android Studio or Xcode for native emulation, if needed

## ⚙️ Backend Setup

1. Open the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on your environment settings:

```env
PORT=3333
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=enterprise_management_system
JWT_SECRET=your_super_secret_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

4. Start the API server:

```bash
node server.js
```

5. Access the API documentation:

```text
http://localhost:3333/api/docs
```

## 📱 Mobile App Setup

1. Open the mobile application folder:

```bash
cd Mobile/deboApp
```

2. Install dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
npx expo start
```

4. Launch the app using:

- Android emulator
- iOS simulator
- Expo Go on a physical device

If the backend is running on a local machine, make sure the mobile app points to the correct API URL, typically:

```text
http://<your-local-ip>:3333/api
```

## 🚀 Production Considerations

For a production deployment, consider:

- 🔒 Environment-specific configuration
- 🛡️ Secure secret management
- 💾 Database backups and monitoring
- 🌐 HTTPS and reverse proxy configuration
- ⚙️ CI/CD pipeline setup
- 🚦 API rate limiting and security optimization

## � Contributors

- Shambel Dechu
- Tedros Teshome
- Bonsa Adugna

## �📄 License

This project is intended for internal or educational use unless otherwise specified by the project owner.

## 📬 Contact

For setup help, architecture questions, or deployment support, contact the project maintainer or repository owner.
