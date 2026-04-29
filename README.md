# Team Task Manager Web Application

A full-stack, production-ready web application for team task management. Built with an **Angular** frontend, **ASP.NET Core Web API** backend (.NET 8/9), and **PostgreSQL** database. Features include JWT Authentication, Role-Based Access Control (RBAC), and responsive UI designed with Tailwind CSS.

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

## 🌐 Deployment Instructions

### 1. Backend Deployment (Railway / Render)
1. **Repository Setup**: Push your code to a GitHub repository.
2. **Railway / Render**: Create a new Web Service and link your repository.
3. **Configuration**:
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/TaskManager.API.dll`
4. **Environment Variables**:
   Add the following variables in the platform's dashboard:
   - `ConnectionStrings__DefaultConnection`: Set to your production PostgreSQL connection string.
   - `JwtSettings__Key`: Generate a strong secret key (e.g., using `openssl rand -base64 32`).
   - `JwtSettings__Issuer`: Your domain name.
   - `JwtSettings__Audience`: Your frontend domain.

### 2. Database Deployment
- **Railway PostgreSQL** or **Supabase** are great options.
- Create a new PostgreSQL database on the platform.
- Copy the connection string and set it in the backend's environment variables.

### 3. Frontend Deployment (Vercel / Netlify)
1. **Repository**: Ensure your `Frontend` folder is pushed.
2. **Platform Setup**: Import the repository into Vercel or Netlify.
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/frontend/browser` (or `dist/task-manager-frontend/browser` depending on angular version).
3. **Environment**:
   Update `src/environments/environment.prod.ts` to point to your live backend API URL before building, or use environment variables during the build process to replace `environment.ts`.
4. **Routing Fixes (Netlify/Vercel)**:
   Ensure you add redirects so Angular routing works on page refresh. 
   - *Netlify*: Create a `_redirects` file in `src/` with: `/* /index.html 200`
   - *Vercel*: Create a `vercel.json` with rewrites pointing to `index.html`.

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
