# Team Task Manager Web Application

A full-stack, production-ready web application for team task management. Built with an **Angular** frontend, **ASP.NET Core Web API** backend (.NET 8/9), and **PostgreSQL** database. Features include JWT Authentication, Role-Based Access Control (RBAC), and responsive UI designed with Tailwind CSS.

---

## 🌐 Live Demo & API
- **Frontend (Railway):** [https://abundant-enthusiasm-production-b23b.up.railway.app](https://abundant-enthusiasm-production-b23b.up.railway.app)
- **Backend API (Railway):** [https://team-task-manager-production-4e6c.up.railway.app](https://team-task-manager-production-4e6c.up.railway.app)

---

## 🛠️ Tech Stack

**Frontend:**
- Angular 17+ (Standalone Components)
- Tailwind CSS
- RxJS

**Backend:**
- ASP.NET Core Web API (.NET 9)
- Entity Framework Core
- PostgreSQL
- JWT Authentication & BCrypt.Net-Next

---

## 🚀 Features

- **Authentication System**: Secure signup, login, password hashing, and JWT handling.
- **RBAC (Role-Based Access Control)**: Admin and Member roles with route protection and UI rendering logic.
- **Project Management**: Admins can create projects and manage members.
- **Task Management**: Create tasks, assign them to members, update status (Todo -> In Progress -> Completed).
- **Dashboard**: Real-time stats showing total, completed, pending, and overdue tasks.
- **Responsive UI**: Clean, dynamic interfaces built with Tailwind CSS.

---

## 💻 Local Setup Guide

### Prerequisites
- .NET 8 or 9 SDK
- Node.js (v18 or v20+)

### 1. Database Setup
The application is pre-configured to use **SQLite** for local development, so no external database installation (like Docker or PostgreSQL) is required to run it locally. The database file (`taskmanager.db`) will be automatically created when you apply migrations.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Apply Database Migrations (ensures tables are created):
   ```bash
   dotnet tool install -g dotnet-ef
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
   *The API will start at `http://localhost:5242` (or the port specified in `Properties/launchSettings.json`).*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update API URL: If your backend runs on a different port, update `src/environments/environment.ts`.
4. Run the Angular development server:
   ```bash
   npm start
   ```
   *The app will be available at `http://localhost:4200`.*

---



## 📖 Application Architecture (Clean Architecture)

- **Controllers**: Handle HTTP requests and responses.
- **DTOs (Data Transfer Objects)**: Encapsulate data sent over the network, decoupling models from endpoints.
- **Services**: Contain business logic (AuthService, ProjectService, TaskService).
- **Data (ApplicationDbContext)**: EF Core configuration and database access.
- **Models**: Database entities.
- **Middleware**: Global exception handling.

## 🔑 Test Credentials

To quickly test the application, you can use the following pre-configured accounts:

- **Admin Account**: 
  - Username/Email: `ankit`
  - Password: `12345678`
- **Member (User) Account**:
  - Username/Email: `rahul`
  - Password: `123456`

---

## ⚠️ Important Notes
- **Admin Setup**: The first user registered with the role `Admin` has full access. Any subsequent users can choose `Member` or `Admin` during signup for testing purposes. In a real-world scenario, Role assignment would be strictly controlled.
- **API Tests**: A Swagger UI is available at `/swagger` on the backend for testing all endpoints. Ensure you click "Authorize" and paste the JWT token after logging in.
