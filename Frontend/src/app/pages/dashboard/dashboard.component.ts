import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, DashboardStats } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-6">
      <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p class="mt-2 text-slate-500 text-lg">
            Here's what's happening with your projects today, 
            <span class="font-semibold text-indigo-600">{{ authService.currentUserValue?.name }}</span>.
          </p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" *ngIf="stats && !loading">
        
        <!-- Total Tasks -->
        <div class="relative bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 shadow-inner shadow-indigo-400">
                <i class="fa-solid fa-list-check text-white text-xl"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</dt>
                  <dd class="text-4xl font-extrabold text-slate-900 mt-1">{{ stats.totalTasks }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Tasks -->
        <div class="relative bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-4 shadow-inner shadow-emerald-300">
                <i class="fa-solid fa-check-double text-white text-xl"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed</dt>
                  <dd class="text-4xl font-extrabold text-slate-900 mt-1">{{ stats.completedTasks }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Tasks -->
        <div class="relative bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 group">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-4 shadow-inner shadow-amber-300">
                <i class="fa-solid fa-hourglass-half text-white text-xl"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</dt>
                  <dd class="text-4xl font-extrabold text-slate-900 mt-1">{{ stats.pendingTasks }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Overdue Tasks -->
        <div class="relative bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 group">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-4 shadow-inner shadow-rose-400">
                <i class="fa-regular fa-clock text-white text-xl"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Overdue</dt>
                  <dd class="text-4xl font-extrabold text-rose-600 mt-1">{{ stats.overdueTasks }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-5xl text-indigo-500 mb-4"></i>
        <p class="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-8">
        <div class="flex items-center">
          <i class="fa-solid fa-circle-exclamation text-red-500 text-xl mr-3"></i>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>
      
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  constructor(
    private taskService: TaskService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.taskService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics.';
        this.loading = false;
      }
    });
  }
}
