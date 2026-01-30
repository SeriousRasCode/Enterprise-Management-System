# 🚀 Project & Task Management System (PTMS)

### What is this?
A digital platform built to replace old-school Excel sheets and paper tracking. It helps companies manage teams, plan projects, and track task progress (0-100%) in real-time.

### Core Features
* **Role-Based Access:** Specific views for **Admin**, **Project Manager**, and **Employee**.
* **Project Tracking:** Managers create projects and assign tasks.
* **Task Updates:** Employees can update task status and percentage via a slider.
* **Cross-Platform:** Shared logic for **Web** and **Mobile** support.

---

### 📂 Folder Structure (The Architecture)
We used a "Type-Based" structure to keep things organized and scalable:
* `src/screens/`: Pages grouped by user role (Admin, Manager, Employee).
* `src/components/`: Reusable UI pieces (Cards, Buttons, Progress Bars).
* `src/services/`: API logic and data fetching (Axios).
* `src/utils/`: Helper functions (date formatting, percentage math).
* `src/types/`: TypeScript interfaces for better code safety.

---

### 🛠 Tech Stack
* **Frontend:** React Native + Expo + TypeScript.
* **Navigation:** React Navigation (Stack).
* **Backend:** [Insert your Backend here - e.g. Node.js / Firebase].
* **Icons:** Lucide-react-native.

---

### 🚀 How to Run (Mobile & Web)

1. **Install dependencies:**
   ```bash
   npm install

2. **Start the Expo server:**
   ```bash
   npx expo start

3. **Open the app:**
* **Mobile:** Scan the QR code with the **Expo Go** app.
* **Web:** Press `w` in the terminal to launch in browser.

### 📝 User Roles
| Role | Permissions |
| :--- | :--- |
| **Admin** | Manage users, roles, and create teams. |
| **Manager** | Create projects and assign tasks to employees. |
| **Employee** | View assigned tasks and update completion %. |

---


