import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'projects', 
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'projects/:id/tasks', 
    loadComponent: () => import('./pages/task-board/task-board.component').then(m => m.TaskBoardComponent),
    canActivate: [authGuard]
  }
];
