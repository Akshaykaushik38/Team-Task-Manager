import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService, DashboardStats } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-8 animate-fade-in-up">

      <!-- ─── Header ─── -->
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <div class="h-8 w-1 rounded-full" style="background: linear-gradient(180deg, #6366f1, #8b5cf6);"></div>
          <p class="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em]">Overview</p>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Good {{ greeting }}, <span class="text-gradient">{{ (authService.currentUserValue?.name || 'there').split(' ')[0] }}</span> 👋
        </h1>
        <p class="mt-3 text-slate-400 text-lg max-w-xl">
          Here's a snapshot of your team's productivity today.
        </p>
      </div>

      <!-- ─── Loading Skeletons ─── -->
      <div *ngIf="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div *ngFor="let i of [1,2,3,4]" class="stat-card rounded-2xl p-6 shimmer h-32"></div>
      </div>

      <!-- ─── Stat Cards ─── -->
      <div *ngIf="stats && !loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">

        <!-- Total Tasks -->
        <div class="stat-card rounded-2xl p-6 group cursor-default animate-fade-in-up delay-100">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                 style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05)); border: 1px solid rgba(99,102,241,0.25);">
              <i class="fa-solid fa-list-check text-indigo-400 text-lg"></i>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style="background:rgba(99,102,241,0.1); color:#818cf8; border:1px solid rgba(99,102,241,0.2);">
              All time
            </span>
          </div>
          <div>
            <div class="text-4xl font-bold text-white tracking-tight mb-1">{{ stats.totalTasks }}</div>
            <div class="text-sm font-medium text-slate-400">Total Tasks</div>
          </div>
          <div class="mt-4 h-1 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.05);">
            <div class="h-full rounded-full transition-all duration-1000"
                 style="width:100%; background: linear-gradient(90deg, #6366f1, #8b5cf6);"></div>
          </div>
        </div>

        <!-- Completed -->
        <div class="stat-card rounded-2xl p-6 group cursor-default animate-fade-in-up delay-200">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                 style="background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05)); border: 1px solid rgba(52,211,153,0.25);">
              <i class="fa-solid fa-check-double text-emerald-400 text-lg"></i>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style="background:rgba(52,211,153,0.1); color:#34d399; border:1px solid rgba(52,211,153,0.2);">
              Done
            </span>
          </div>
          <div>
            <div class="text-4xl font-bold text-white tracking-tight mb-1">{{ stats.completedTasks }}</div>
            <div class="text-sm font-medium text-slate-400">Completed</div>
          </div>
          <div class="mt-4 h-1 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.05);">
            <div class="h-full rounded-full transition-all duration-1000"
                 [style]="'width:' + completedPct + '%; background: linear-gradient(90deg, #10b981, #34d399);'"></div>
          </div>
        </div>

        <!-- Pending -->
        <div class="stat-card rounded-2xl p-6 group cursor-default animate-fade-in-up delay-300">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                 style="background: linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05)); border: 1px solid rgba(251,191,36,0.25);">
              <i class="fa-solid fa-hourglass-half text-amber-400 text-lg"></i>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style="background:rgba(251,191,36,0.1); color:#fbbf24; border:1px solid rgba(251,191,36,0.2);">
              Active
            </span>
          </div>
          <div>
            <div class="text-4xl font-bold text-white tracking-tight mb-1">{{ stats.pendingTasks }}</div>
            <div class="text-sm font-medium text-slate-400">Pending</div>
          </div>
          <div class="mt-4 h-1 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.05);">
            <div class="h-full rounded-full transition-all duration-1000"
                 [style]="'width:' + pendingPct + '%; background: linear-gradient(90deg, #d97706, #fbbf24);'"></div>
          </div>
        </div>

        <!-- Overdue -->
        <div class="stat-card rounded-2xl p-6 group cursor-default animate-fade-in-up delay-400">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                 style="background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05)); border: 1px solid rgba(239,68,68,0.25);">
              <i class="fa-regular fa-clock text-rose-400 text-lg"></i>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style="background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2);">
              Urgent
            </span>
          </div>
          <div>
            <div class="text-4xl font-bold mb-1"
                 [style]="stats.overdueTasks > 0 ? 'color:#f87171' : 'color:#fff'">
              {{ stats.overdueTasks }}
            </div>
            <div class="text-sm font-medium text-slate-400">Overdue</div>
          </div>
          <div class="mt-4 h-1 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.05);">
            <div class="h-full rounded-full transition-all duration-1000"
                 [style]="'width:' + overduePct + '%; background: linear-gradient(90deg, #dc2626, #f87171);'"></div>
          </div>
        </div>
      </div>

      <!-- ─── Progress Summary ─── -->
      <div *ngIf="stats && !loading" class="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up delay-500">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-lg font-bold text-white">Overall Progress</h2>
            <p class="text-sm text-slate-400 mt-0.5">Completion rate across all tasks</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-3xl font-bold text-white">{{ completedPct }}%</span>
            <span class="text-sm text-slate-400">complete</span>
          </div>
        </div>

        <!-- Progress Track -->
        <div class="h-3 rounded-full overflow-hidden mb-6" style="background:rgba(255,255,255,0.05);">
          <div class="h-full rounded-full transition-all duration-1000 relative"
               [style]="'width:' + completedPct + '%; background: linear-gradient(90deg, #6366f1, #8b5cf6, #34d399);'">
            <div class="absolute right-0 top-0 bottom-0 w-3 rounded-full animate-pulse" style="background:rgba(255,255,255,0.4);"></div>
          </div>
        </div>

        <!-- Legend -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full flex-shrink-0" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);"></div>
            <div>
              <p class="text-xs text-slate-500">Total</p>
              <p class="text-sm font-bold text-white">{{ stats.totalTasks }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full flex-shrink-0" style="background: linear-gradient(135deg, #10b981, #34d399);"></div>
            <div>
              <p class="text-xs text-slate-500">Done</p>
              <p class="text-sm font-bold text-white">{{ stats.completedTasks }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full flex-shrink-0" style="background: linear-gradient(135deg, #d97706, #fbbf24);"></div>
            <div>
              <p class="text-xs text-slate-500">Pending</p>
              <p class="text-sm font-bold text-white">{{ stats.pendingTasks }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full flex-shrink-0" style="background: linear-gradient(135deg, #dc2626, #f87171);"></div>
            <div>
              <p class="text-xs text-slate-500">Overdue</p>
              <p class="text-sm font-bold" [style]="stats.overdueTasks > 0 ? 'color:#f87171' : 'color:#fff'">{{ stats.overdueTasks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Quick Actions ─── -->
      <div *ngIf="stats && !loading" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up delay-500">
        <a routerLink="/projects"
           class="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer border border-transparent">
          <div class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
               style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 0 20px rgba(99,102,241,0.3);">
            <i class="fa-solid fa-folder-open text-white text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white">Browse Projects</p>
            <p class="text-xs text-slate-400 mt-0.5">View all your team projects</p>
          </div>
          <i class="fa-solid fa-chevron-right text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200"></i>
        </a>

        <div class="glass-card rounded-2xl p-5 flex items-center gap-4 border border-transparent">
          <div class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
               style="background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05)); border: 1px solid rgba(52,211,153,0.2);">
            <i class="fa-solid fa-trophy text-emerald-400 text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white">Completion Rate</p>
            <p class="text-xs text-slate-400 mt-0.5">
              <span [style]="completedPct >= 70 ? 'color:#34d399' : completedPct >= 40 ? 'color:#fbbf24' : 'color:#f87171'" class="font-bold">
                {{ completedPct }}%
              </span>
              — {{ completedPct >= 70 ? 'Great work!' : completedPct >= 40 ? 'Keep going!' : 'Needs attention' }}
            </p>
          </div>
        </div>
      </div>

      <!-- ─── Error ─── -->
      <div *ngIf="error && !loading"
           class="flex items-center gap-3 px-5 py-4 rounded-2xl mt-8 animate-fade-in"
           style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);">
        <i class="fa-solid fa-circle-exclamation text-rose-400 text-xl flex-shrink-0"></i>
        <p class="text-rose-300 font-medium">{{ error }}</p>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  greeting = '';
  completedPct = 0;
  pendingPct = 0;
  overduePct = 0;

  constructor(private taskService: TaskService, public authService: AuthService) {
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  }

  ngOnInit() {
    this.taskService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        const total = data.totalTasks || 1;
        this.completedPct = Math.round((data.completedTasks / total) * 100);
        this.pendingPct   = Math.round((data.pendingTasks / total) * 100);
        this.overduePct   = Math.round((data.overdueTasks / total) * 100);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard statistics.';
        this.loading = false;
      }
    });
  }
}
