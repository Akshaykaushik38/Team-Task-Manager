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
    <div class="py-6">
      <div class="animate-fade-in-up">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Your Projects</h1>
          <p class="mt-2 text-slate-500 text-lg">Manage teams and task boards</p>
        </div>
        <button *ngIf="authService.isAdmin()" (click)="showCreateModal = true" class="group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <i class="fa-solid fa-plus mr-2 group-hover:rotate-90 transition-transform duration-300"></i> New Project
        </button>
      </div>

      <!-- Project List -->
      <div *ngIf="projects.length === 0 && !loading" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed">
        <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-regular fa-folder-open text-3xl text-indigo-400"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-700">No projects found</h3>
        <p class="text-slate-500 mt-2 max-w-sm mx-auto">Get started by creating a new project or waiting for an invitation.</p>
        <button *ngIf="authService.isAdmin()" (click)="showCreateModal = true" class="mt-6 text-indigo-600 font-medium hover:text-indigo-800">
          Create your first project &rarr;
        </button>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let project of projects" class="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 relative">
          <!-- Decorative Top Accent -->
          <div class="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0"></div>
          
          <div class="p-6 flex-1 pt-8">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{{ project.name }}</h3>
              <span class="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md border border-indigo-100">
                #{{ project.id }}
              </span>
            </div>
            
            <p class="text-sm text-slate-500 mb-6 flex items-center">
              <i class="fa-regular fa-calendar-plus mr-2 opacity-70"></i> Created on {{ project.createdAt | date:'mediumDate' }}
              <br/>
              <i class="fa-solid fa-user-pen mr-2 opacity-70 mt-1"></i> by {{ project.createdByName }}
            </p>
            
            <div class="flex items-center gap-4 text-sm font-medium text-slate-600">
              <div class="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg">
                <i class="fa-solid fa-users text-indigo-400 mr-2"></i> {{ project.memberCount }}
              </div>
              <div class="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg">
                <i class="fa-solid fa-list-check text-purple-400 mr-2"></i> {{ project.taskCount }}
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 group-hover:bg-indigo-50/30 transition-colors">
            <a [routerLink]="['/projects', project.id, 'tasks']" class="flex justify-between items-center text-indigo-600 hover:text-indigo-800 font-bold text-sm w-full">
              Open Board <i class="fa-solid fa-arrow-right-long transform group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-5xl text-indigo-500 mb-4"></i>
        <p class="text-slate-500 font-medium animate-pulse">Loading projects...</p>
      </div>
      </div> <!-- End of animated container -->

      <!-- Create Project Modal -->
      <div *ngIf="showCreateModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Background backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="showCreateModal = false"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <!-- Modal panel -->
            <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i class="fa-solid fa-folder-plus text-indigo-600"></i>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-xl leading-6 font-bold text-slate-900" id="modal-title">Create New Project</h3>
                    <div class="mt-4">
                      <label class="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                      <input type="text" [(ngModel)]="newProjectName" class="block w-full px-4 py-3 border border-slate-300 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="e.g. Website Redesign">
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
                <button type="button" (click)="createProject()" [disabled]="!newProjectName" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Create Project
                </button>
                <button type="button" (click)="showCreateModal = false" class="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-6 py-2.5 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                  Cancel
                </button>
              </div>
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

  constructor(
    private projectService: ProjectService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  createProject() {
    if (!this.newProjectName) return;
    this.projectService.createProject(this.newProjectName).subscribe({
      next: (project) => {
        this.projects.push(project);
        this.showCreateModal = false;
        this.newProjectName = '';
      }
    });
  }
}
