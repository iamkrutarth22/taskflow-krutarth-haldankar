# TaskFlow – Project Management Dashboard

## Overview

TaskFlow is a frontend project management application built using React, TypeScript, and Vite. It allows users to manage projects and tasks through a clean and responsive interface. The application uses Mock Service Worker (MSW) to simulate backend APIs, enabling full functionality without a real backend.

---

## Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/taskflow-krutarth-haldankar
   cd taskflow-krutarth-haldankar
   ```

2. Create environment file:
   ```bash
   cp .env.example frontend/.env
   ```
   For Windows (PowerShell):
   ```powershell
   copy .env.example frontend\.env
   ```

3. Start the application:
   ```bash
   docker compose up --build
   ```

4. Open in browser:
   ```
   http://localhost:5173
   ```

### Without Docker

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://localhost:5173
   ```

---

## Features Implemented

- User Authentication (Login and Register UI)
- Protected routes for authenticated users
- Dashboard displaying project statistics and recent projects
- Project listing page
- Project details page with tasks
- Task creation and task filtering
- My Tasks page for user-specific task tracking
- Component-based modular architecture
- Global state management using Redux Toolkit
- API handling using Axios
- Mock API integration using MSW (Mock Service Worker)
- Responsive UI design
- Theme support (light/dark mode)

---

## Tech Stack

| Category       | Technology              |
|----------------|-------------------------|
| Framework      | React + TypeScript      |
| Build Tool     | Vite                    |
| State          | Redux Toolkit           |
| Styling        | Tailwind CSS            |
| HTTP Client    | Axios                   |
| Mock API       | MSW (Mock Service Worker) |
| Containerization | Docker               |

---

## Environment Variables

Create a `.env` file inside the `frontend` folder with the following:

```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## Docker Setup

This project is containerized and can be run using Docker.

- `Dockerfile` is located inside the `frontend` folder
- `docker-compose.yml` is located at the root

**Run:**
```bash
docker compose up --build
```

**Stop:**
```bash
docker compose down
```

---

## Notes

- The application uses MSW to mock backend APIs — no real backend is required
- Default port is `5173`
- If the port is already in use, update the port mapping in `docker-compose.yml`

---

## Time Taken

2.5 days

---

## Author

Krutarth Haldankar
