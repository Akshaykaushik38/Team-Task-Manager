<div align="center">

# 🚀 TeamTasker — Team Task Manager

### A Modern, Full-Stack Task Management Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Railway-blueviolet?style=for-the-badge)](https://team-task-manager-production-2a17.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Akshaykaushik38/Team-Task-Manager)
[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![.NET](https://img.shields.io/badge/.NET_9-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

*Built with Angular 17+ · ASP.NET Core · PostgreSQL · JWT Auth · Tailwind CSS*

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Application Architecture](#-application-architecture)
- [Screenshots](#-screenshots)
- [Local Setup Guide](#-local-setup-guide)
- [API Documentation](#-api-documentation)
- [Test Credentials](#-test-credentials)
- [Deployment](#-deployment)
- [Important Notes](#-important-notes)

---

## 🎯 Overview

**TeamTasker** is a production-ready, full-stack web application for managing team projects and tasks. It features a premium dark-themed UI with glassmorphism design, real-time Kanban boards, role-based access control, and a comprehensive dashboard — all deployed and running on Railway.

### What makes it stand out?
- 🎨 **Premium Dark UI** — Glassmorphism, micro-animations, gradient accents
- 🔐 **Secure Authentication** — JWT tokens with bcrypt password hashing
- 👥 **Role-Based Access** — Admin & Member roles with fine-grained permissions
- 📊 **Real-Time Dashboard** — Live stats with animated progress indicators
- 📋 **Kanban Task Board** — Drag-free, click-based task flow (Todo → In Progress → Completed)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Application** | [https://team-task-manager-production-2a17.up.railway.app](https://team-task-manager-production-2a17.up.railway.app) |
| **API Swagger** | [https://team-task-manager-production-2a17.up.railway.app/swagger](https://team-task-manager-production-2a17.up.railway.app/swagger) |

> **Note:** The application is hosted on Railway's free tier. The initial load may take a few seconds if the service is cold-starting.

---

## ✨ Key Features

### 🔑 Authentication & Authorization
- Secure user registration and login with JWT tokens
- Password hashing using BCrypt
- Route guards for protected pages
- Persistent sessions via localStorage

### 👤 Role-Based Access Control (RBAC)
| Capability | Admin | Member |
|---|:---:|:---:|
| Create projects | ✅ | ❌ |
| Manage team members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Move tasks between columns | ✅ | ✅ |
| View dashboard & projects | ✅ | ✅ |

### 📊 Dashboard
- Animated stat cards (Total, Completed, Pending, Overdue)
- Overall progress bar with completion percentage
- Time-of-day personalized greeting
- Quick action navigation cards

### 📁 Project Management
- Create and browse projects with gradient-colored cards
- Member count and task count per project
- Add/remove team members via email invitation
- Project owner identification

### 📋 Kanban Task Board
- Three-column layout: **To Do** → **In Progress** → **Completed**
- Color-coded columns with status badges
- Hover-to-reveal action buttons
- Task assignment with user avatars
- Due date tracking with overdue indicators

### 🎨 Premium UI/UX
- Dark theme with glassmorphism design system
- Smooth micro-animations and transitions
- Animated floating background blobs on auth pages
- Custom scrollbar styling
- Fully responsive across all devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Angular 17+** | SPA framework with standalone components |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **RxJS** | Reactive data handling |
| **Font Awesome 6** | Icon library |
| **Google Fonts** | Inter & Plus Jakarta Sans typography |

### Backend
| Technology | Purpose |
|---|---|
| **ASP.NET Core (.NET 9)** | RESTful API framework |
| **Entity Framework Core** | ORM for database operations |
| **PostgreSQL** | Production database (Railway) |
| **SQLite** | Local development database |
| **JWT Bearer Auth** | Token-based authentication |
| **BCrypt.Net-Next** | Password hashing |
| **Swagger / OpenAPI** | API documentation |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| **Railway** | Cloud hosting (PaaS) |
| **Docker** | Containerized deployment |
| **Nginx** | Frontend static file serving |
| **GitHub** | Version control & CI trigger |

---

## 🏗️ Application Architecture

```
Team-Task-Manager/
├── Frontend/                    # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/           # Page components
│   │   │   │   ├── login/       # Login page
│   │   │   │   ├── signup/      # Registration page
│   │   │   │   ├── dashboard/   # Stats dashboard
│   │   │   │   ├── projects/    # Project listing
│   │   │   │   └── task-board/  # Kanban board
│   │   │   ├── services/        # API services (Auth, Task, Project)
│   │   │   ├── guards/          # Route guards
│   │   │   ├── interceptors/    # HTTP interceptors (JWT)
│   │   │   ├── app.component.ts # Root component (navbar)
│   │   │   ├── app.routes.ts    # Route definitions
│   │   │   └── app.config.ts    # App configuration
│   │   ├── environments/        # Environment configs
│   │   ├── styles.css           # Global design system
│   │   └── index.html           # Entry HTML
│   └── angular.json             # Angular CLI config
│
├── Backend/                     # ASP.NET Core API
│   ├── Controllers/             # API endpoints
│   ├── Services/                # Business logic layer
│   ├── Models/                  # Database entities
│   ├── DTOs/                    # Data transfer objects
│   ├── Data/                    # EF Core DbContext
│   ├── Middleware/              # Global exception handling
│   ├── Migrations/              # Database migrations
│   └── Program.cs              # App entry point & config
│
├── Dockerfile                   # Multi-stage build
├── docker-compose.yml           # Local orchestration
├── entrypoint.sh                # Container startup script
└── railway.toml                 # Railway deployment config
```

### Backend Architecture Pattern

```
HTTP Request
    │
    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Controller  │───▶│   Service    │───▶│  DbContext   │───▶│  PostgreSQL  │
│  (API Layer) │    │  (Business)  │    │   (EF Core)  │    │  (Database)  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                    │
       ▼                    ▼
   DTO Response      Model Entities
```

---

## 📸 Screenshots

> The application features a premium dark-themed UI with glassmorphism effects, gradient accents, and smooth animations across all pages.

| Page | Description |
|---|---|
| **Login** | Dark glassmorphism card with animated floating blob background |
| **Signup** | Role selector (Admin/Member) with staggered field animations |
| **Dashboard** | Animated stat cards, progress bars, personalized greeting |
| **Projects** | Gradient-colored project cards with member/task counts |
| **Kanban Board** | Three-column task board with hover actions and status badges |

---

## 💻 Local Setup Guide

### Prerequisites

| Requirement | Version |
|---|---|
| .NET SDK | 8.0 or 9.0 |
| Node.js | v18+ or v20+ |
| npm | v9+ |

### 1. Clone the Repository
```bash
git clone https://github.com/Akshaykaushik38/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Backend Setup

The application uses **SQLite** for local development — no external database required.

```bash
cd Backend

# Restore dependencies
dotnet restore

# Apply database migrations
dotnet tool install -g dotnet-ef
dotnet ef database update

# Start the API server
dotnet run
```
> API will be available at `http://localhost:5263`

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start the dev server
npm start
```
> App will be available at `http://localhost:4200`

### 4. Environment Configuration

If your backend runs on a different port, update `Frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5263'  // Update port if needed
};
```

---

## 📡 API Documentation

The API exposes the following endpoints. Full interactive documentation is available via **Swagger UI** at `/swagger`.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects for current user |
| `GET` | `/api/projects/:id` | Get project details |
| `POST` | `/api/projects` | Create a new project (Admin only) |
| `GET` | `/api/projects/:id/members` | List project members |
| `POST` | `/api/projects/:id/members` | Add member by email (Admin only) |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove member (Admin only) |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks/project/:projectId` | Get tasks for a project |
| `POST` | `/api/tasks` | Create a new task (Admin only) |
| `PUT` | `/api/tasks/:id/status` | Update task status (All members) |
| `GET` | `/api/tasks/dashboard` | Get dashboard statistics |

> 🔒 All endpoints (except auth) require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🔑 Test Credentials

Use these pre-configured accounts on the live demo:

| Role | Email | Password |
|---|---|---|
| **Admin** | `ankit` | `12345678` |
| **Member** | `rahul` | `123456` |

> Or create your own account via the **Sign Up** page.

---

## 🚀 Deployment

The application is deployed as a **single Docker container** on Railway, serving both the Angular frontend (via Nginx) and the .NET backend.

### Deployment Architecture
```
Railway (Single Service)
├── Docker Container
│   ├── Nginx (Port 80) ─── Serves Angular static files
│   │   └── Proxies /api/* requests to .NET backend
│   └── .NET API (Port 5000) ─── Handles API requests
└── PostgreSQL (Managed Add-on)
```

### Auto-Deploy
Pushing to the `main` branch on GitHub triggers an automatic deployment on Railway.

---

## ⚠️ Important Notes

- **Admin Privileges**: The first user registered with `Admin` role gets full project management access. In production, role assignment should be strictly controlled.
- **API Testing**: Swagger UI is available at `/swagger` — click "Authorize" and paste your JWT token to test authenticated endpoints.
- **Cold Starts**: Railway free tier may take a few seconds on first load if the service has been idle.
- **Local vs Production**: Local development uses SQLite; production uses PostgreSQL on Railway.

---

<div align="center">

**Built with ❤️ by [Akshay Kaushik](https://github.com/Akshaykaushik38)**

</div>
