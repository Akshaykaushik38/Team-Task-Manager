import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-8 animate-fade-in-up">

      <!-- ─── Header ─── -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="h-8 w-1 rounded-full" style="background: linear-gradient(180deg, #8b5cf6, #6366f1);"></div>
            <p class="text-xs font-semibold text-purple-400 uppercase tracking-[0.2em]">Workspace</p>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">Your Projects</h1>
          <p class="mt-3 text-slate-400 text-lg">{{ projects.length }} project{{ projects.length !== 1 ? 's' : '' }} in your workspace</p>
        </div>

        <button *ngIf="authService.isAdmin()" (click)="showCreateModal = true" id="create-project-btn"
                class="btn-primary flex-shrink-0 group gap-2">
          <div class="h-5 w-5 rounded-md flex items-center justify-center"
               style="background:rgba(255,255,255,0.15);">
            <i class="fa-solid fa-plus text-xs group-hover:rotate-90 transition-transform duration-300"></i>
          </div>
          New Project
        </button>
      </div>

      <!-- ─── Loading Skeletons ─── -->
      <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3]" class="stat-card rounded-2xl h-56 shimmer"></div>
      </div>

      <!-- ─── Empty State ─── -->
      <div *ngIf="projects.length === 0 && !loading"
           class="glass-card rounded-2xl py-20 text-center animate-fade-in">
        <div class="inline-flex h-20 w-20 rounded-2xl items-center justify-center mb-6 animate-float"
             style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1)); border:1px solid rgba(99,102,241,0.2);">
          <i class="fa-regular fa-folder-open text-4xl text-indigo-400"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No projects yet</h3>
        <p class="text-slate-400 text-sm max-w-xs mx-auto mb-6">
          Get started by creating your first project and inviting your team.
        </p>
        <button *ngIf="authService.isAdmin()" (click)="showCreateModal = true"
                class="btn-primary inline-flex gap-2">
          <i class="fa-solid fa-plus text-sm"></i>
          Create First Project
        </button>
      </div>

      <!-- ─── Project Grid ─── -->
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let project of projects; let i = index"
             class="group glass-card rounded-2xl overflow-hidden flex flex-col relative cursor-pointer animate-fade-in-up"
             [style]="'animation-delay:' + (i * 0.08) + 's;'">

          <!-- Top gradient accent -->
          <div class="h-1 w-full flex-shrink-0"
               [style]="'background: linear-gradient(90deg, ' + getProjectGradient(i) + ');'"></div>

          <!-- Hover glow overlay -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
               [style]="'background: radial-gradient(ellipse at top left, ' + getProjectGlowColor(i) + ' 0%, transparent 60%);'"></div>

          <div class="relative p-6 flex flex-col flex-1">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <!-- Project icon -->
              <div class="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                   [style]="'background: linear-gradient(135deg, ' + getProjectGradient(i) + '); box-shadow: 0 4px 15px ' + getProjectShadow(i) + ';'">
                <i class="fa-solid fa-folder text-white text-base"></i>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style="background:rgba(255,255,255,0.05); color:#64748b; border:1px solid rgba(255,255,255,0.08);">
                #{{ project.id }}
              </span>
            </div>

            <!-- Name -->
            <h3 class="text-lg font-bold text-white mb-1 leading-tight group-hover:text-indigo-300 transition-colors duration-200">
              {{ project.name }}
            </h3>

            <!-- Meta -->
            <div class="flex flex-col gap-1.5 mb-5 text-xs text-slate-500">
              <span class="flex items-center gap-2">
                <i class="fa-regular fa-calendar text-slate-600 w-3"></i>
                Created {{ project.createdAt | date:'MMM d, y' }}
              </span>
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-user-pen text-slate-600 w-3"></i>
                by <span class="text-slate-400 font-medium">{{ project.createdByName }}</span>
              </span>
            </div>

            <!-- Stats chips -->
            <div class="flex items-center gap-2 mt-auto mb-5">
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                   style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); color:#818cf8;">
                <i class="fa-solid fa-users text-xs"></i>
                {{ project.memberCount }} member{{ project.memberCount !== 1 ? 's' : '' }}
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                   style="background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.2); color:#c084fc;">
                <i class="fa-solid fa-list-check text-xs"></i>
                {{ project.taskCount }} task{{ project.taskCount !== 1 ? 's' : '' }}
              </div>
            </div>

            <!-- Footer CTA -->
            <a [routerLink]="['/projects', project.id, 'tasks']"
               class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
               style="background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); color:#818cf8;">
              <span>Open Board</span>
              <i class="fa-solid fa-arrow-right text-xs group-hover/btn:translate-x-1.5 transition-transform duration-200"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- ─── Create Project Modal ─── -->
      <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-md" (click)="showCreateModal = false"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-md animate-fade-in-up z-10">
          <!-- Glow -->
          <div class="absolute -inset-0.5 rounded-2xl opacity-50"
               style="background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.3)); filter:blur(8px);"></div>

          <div class="relative glass-modal rounded-2xl p-7">
            <!-- Modal Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl flex items-center justify-center"
                     style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow:0 0 20px rgba(99,102,241,0.4);">
                  <i class="fa-solid fa-folder-plus text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">New Project</h3>
                  <p class="text-xs text-slate-500">Add a project to your workspace</p>
                </div>
              </div>
              <button (click)="showCreateModal = false"
                      class="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <!-- Input -->
            <div class="space-y-1.5 mb-6">
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Name</label>
              <input type="text" [(ngModel)]="newProjectName" id="new-project-name"
                     placeholder="e.g. Website Redesign, Mobile App..."
                     class="input-dark text-sm"
                     (keyup.enter)="createProject()">
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button (click)="showCreateModal = false"
                      class="btn-secondary flex-1">
                Cancel
              </button>
              <button (click)="createProject()" id="confirm-create-project"
                      [disabled]="!newProjectName.trim()"
                      class="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                <i class="fa-solid fa-plus mr-2 text-sm"></i>
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  showCreateModal = false;
  newProjectName = '';

  private gradients = [
    ['#6366f1', '#8b5cf6'],
    ['#8b5cf6', '#ec4899'],
    ['#06b6d4', '#6366f1'],
    ['#10b981', '#06b6d4'],
    ['#f59e0b', '#ef4444'],
    ['#ec4899', '#8b5cf6'],
  ];

  constructor(private projectService: ProjectService, public authService: AuthService) {}

  ngOnInit() { this.loadProjects(); }

  loadProjects() {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (data) => { this.projects = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  createProject() {
    if (!this.newProjectName.trim()) return;
    this.projectService.createProject(this.newProjectName.trim()).subscribe({
      next: (project) => {
        this.projects.push(project);
        this.showCreateModal = false;
        this.newProjectName = '';
      }
    });
  }

  getProjectGradient(i: number): string {
    const g = this.gradients[i % this.gradients.length];
    return `${g[0]}, ${g[1]}`;
  }

  getProjectGlowColor(i: number): string {
    const g = this.gradients[i % this.gradients.length];
    return g[0] + '18';
  }

  getProjectShadow(i: number): string {
    const g = this.gradients[i % this.gradients.length];
    return g[0] + '40';
  }
}
