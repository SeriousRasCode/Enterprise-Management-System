# Debo App Mobile

The Debo App is the mobile client for the Enterprise Management System. It provides a streamlined experience for employees, managers, and administrators to access tasks, view project information, and manage work from a mobile device.

## Overview

This application is built with Expo and React Native to deliver a fast, responsive mobile interface for a modern enterprise workflow. It connects to the backend API to authenticate users, fetch dashboard data, manage project information, and update task progress.

## Core Features

- User login and session handling
- Role-aware mobile screens
- Dashboard overview
- Project and task browsing
- Task progress updates
- Notification viewing
- Responsive and mobile-friendly UI
- Connection to backend API services

## Tech Stack

- Expo
- React Native
- React Navigation
- Axios
- AsyncStorage
- Zustand
- Expo Router

## Project Structure

```text
Mobile/deboApp/
├── app/
├── assets/
├── components/
├── constants/
├── hooks/
├── scripts/
├── src/
├── app.json
├── app.config.js
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm
- Expo CLI
- Android Studio or iOS Simulator
- A running backend API instance

## Installation

```bash
cd Mobile/deboApp
npm install
```

## Run the App

Start the development server:

```bash
npx expo start
```

You can then open the app in:

- Expo Go on a physical Android or iOS device
- Android emulator
- iOS simulator
- Web preview if supported by your environment

## API Configuration

Set the API base URL for the backend before running the app. Usually this is the local backend address:

```text
http://<your-local-ip>:3333/api
```

If your app uses environment variables, add them to a suitable config file or app config before launching the project.

## Typical User Workflow

1. User signs in
2. Session token is stored locally
3. Dashboard data loads from the backend
4. User reviews assigned work and project updates
5. Task completion or progress changes are sent back to the API

## Development Notes

- Keep API URLs consistent across environments
- Test login and token refresh flows carefully
- Handle network errors and offline states gracefully
- Prefer reusable components for dashboard and task UI

## Production Considerations

For release builds, review:

- secure authentication flow
- environment-specific API endpoints
- app signing and certificates
- performance optimization
- release notes and versioning

## Related Project

This mobile application is designed to work with the backend service in the `Backend/` directory and is part of the broader Enterprise Management System.
