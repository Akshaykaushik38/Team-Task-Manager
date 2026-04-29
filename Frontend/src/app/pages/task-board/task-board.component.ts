import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskItem } from '../../services/task.service';
import { ProjectService, Project, ProjectMember } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="py-6 h-[calc(100vh-6rem)] flex flex-col">
      <div class="flex-1 flex flex-col animate-fade-in-up">
      <!-- Header Area -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 flex-shrink-0">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ project?.name || 'Loading Project...' }}</h1>
            <span *ngIf="project" class="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-md">ID: {{ project.id }}</span>
          </div>
          <p class="text-slate-500 mt-1">Manage tasks and team members</p>
        </div>
        
        <div class="flex space-x-3">
          <button *ngIf="authService.isAdmin()" (click)="showMemberModal = true" class="flex items-center bg-white border border-slate-300 shadow-sm text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="fa-solid fa-users mr-2 text-indigo-500"></i> Members
          </button>
          <button *ngIf="authService.isAdmin()" (click)="showCreateTaskModal = true" class="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md text-white px-4 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="fa-solid fa-plus mr-2"></i> Add Task
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 flex flex-col md:flex-row gap-6 overflow-x-auto pb-6">
        
        <!-- Todo Column -->
        <div class="flex-1 min-w-[320px] max-w-sm flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-4 px-1">
            <h2 class="font-bold text-slate-700 flex items-center text-lg">
              <span class="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] mr-3"></span> To Do
            </h2>
            <span class="text-xs font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{{ getTasksByStatus('Todo').length }}</span>
          </div>
          <div class="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
            <div *ngFor="let task of getTasksByStatus('Todo')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-slate-800 leading-snug">{{ task.title }}</h3>
                <button (click)="updateStatus(task, 'InProgress')" class="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 hover:text-indigo-700 p-1" title="Start Task">
                  <i class="fa-solid fa-circle-play text-xl"></i>
                </button>
              </div>
              <p class="text-sm text-slate-500 mt-2 line-clamp-2">{{ task.description }}</p>
              
              <div class="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <div class="flex items-center text-xs font-medium" [ngClass]="task.isOverdue ? 'text-rose-500 bg-rose-50 px-2 py-1 rounded-md' : 'text-slate-500'">
                  <i class="fa-regular fa-calendar mr-1.5"></i> {{ task.dueDate ? (task.dueDate | date:'MMM d') : 'No Date' }}
                </div>
                <div class="flex items-center">
                  <span class="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 flex items-center" *ngIf="task.assignedToName">
                    <i class="fa-regular fa-user mr-1.5 opacity-70"></i> {{ task.assignedToName }}
                  </span>
                </div>
              </div>
            </div>
            
            <div *ngIf="getTasksByStatus('Todo').length === 0" class="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              No pending tasks
            </div>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="flex-1 min-w-[320px] max-w-sm flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-4 px-1">
            <h2 class="font-bold text-slate-700 flex items-center text-lg">
              <span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] mr-3"></span> In Progress
            </h2>
            <span class="text-xs font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{{ getTasksByStatus('InProgress').length }}</span>
          </div>
          <div class="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
            <div *ngFor="let task of getTasksByStatus('InProgress')" class="bg-white p-5 rounded-xl shadow-sm border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              <!-- Active Indicator Bar -->
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              
              <div class="flex justify-between items-start pl-2">
                <h3 class="font-bold text-slate-800 leading-snug">{{ task.title }}</h3>
              </div>
              <p class="text-sm text-slate-500 mt-2 pl-2 line-clamp-2">{{ task.description }}</p>
              
              <div class="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center pl-2">
                <div class="flex items-center text-xs font-medium" [ngClass]="task.isOverdue ? 'text-rose-500 bg-rose-50 px-2 py-1 rounded-md' : 'text-slate-500'">
                  <i class="fa-regular fa-calendar mr-1.5"></i> {{ task.dueDate ? (task.dueDate | date:'MMM d') : 'No Date' }}
                </div>
                <div class="flex items-center">
                  <span class="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 flex items-center" *ngIf="task.assignedToName">
                    <i class="fa-regular fa-user mr-1.5 opacity-70"></i> {{ task.assignedToName }}
                  </span>
                </div>
              </div>
              
              <div class="mt-4 pl-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="updateStatus(task, 'Todo')" class="flex-1 text-xs font-bold bg-slate-100 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                  <i class="fa-solid fa-pause mr-1"></i> Pause
                </button>
                <button (click)="updateStatus(task, 'Completed')" class="flex-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-200 transition-colors shadow-sm">
                  <i class="fa-solid fa-check mr-1"></i> Complete
                </button>
              </div>
            </div>
            
            <div *ngIf="getTasksByStatus('InProgress').length === 0" class="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              No active tasks
            </div>
          </div>
        </div>

        <!-- Completed Column -->
        <div class="flex-1 min-w-[320px] max-w-sm flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-4 px-1">
            <h2 class="font-bold text-slate-700 flex items-center text-lg">
              <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] mr-3"></span> Completed
            </h2>
            <span class="text-xs font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{{ getTasksByStatus('Completed').length }}</span>
          </div>
          <div class="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
            <div *ngFor="let task of getTasksByStatus('Completed')" class="bg-white/60 p-5 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 group relative">
              
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-slate-500 line-through decoration-slate-400">{{ task.title }}</h3>
                <button *ngIf="authService.isAdmin()" (click)="updateStatus(task, 'InProgress')" class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 p-1" title="Reopen Task">
                  <i class="fa-solid fa-rotate-left text-sm"></i>
                </button>
              </div>
              <p class="text-sm text-slate-400 mt-1 line-clamp-1">{{ task.description }}</p>
              
              <div class="mt-3 flex justify-between items-center">
                <span class="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  <i class="fa-solid fa-check-double mr-1"></i> Done
                </span>
                <span class="text-xs font-medium text-slate-400" *ngIf="task.assignedToName">
                  {{ task.assignedToName }}
                </span>
              </div>
            </div>
            
            <div *ngIf="getTasksByStatus('Completed').length === 0" class="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              No completed tasks
            </div>
          </div>
        </div>
      </div>
      </div> <!-- End of animated container -->

      <!-- Modals (Create Task / Manage Members) - keeping layout similar but upgrading design -->
      <!-- Create Task Modal -->
      <div *ngIf="showCreateTaskModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="showCreateTaskModal = false"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-xl leading-6 font-bold text-slate-900 mb-5 flex items-center">
                  <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <i class="fa-solid fa-list-check text-indigo-600"></i>
                  </div>
                  Add New Task
                </h3>
                <div class="space-y-5">
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Title</label>
                    <input type="text" [(ngModel)]="newTask.title" class="block w-full px-4 py-2.5 border border-slate-300 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Task title">
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea [(ngModel)]="newTask.description" rows="3" class="block w-full px-4 py-2.5 border border-slate-300 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Task details..."></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                    <input type="date" [(ngModel)]="newTask.dueDate" class="block w-full px-4 py-2.5 border border-slate-300 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
                <button type="button" (click)="createTask()" [disabled]="!newTask.title" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50">Save Task</button>
                <button type="button" (click)="showCreateTaskModal = false" class="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-6 py-2.5 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Members Modal -->
      <div *ngIf="showMemberModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="showMemberModal = false"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-xl leading-6 font-bold text-slate-900 mb-5 flex items-center">
                  <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <i class="fa-solid fa-users text-indigo-600"></i>
                  </div>
                  Manage Team
                </h3>
                
                <!-- Add member form -->
                <div class="flex space-x-2 mb-6">
                  <div class="relative flex-1">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-envelope text-slate-400"></i>
                    </div>
                    <input type="email" [(ngModel)]="newMemberEmail" placeholder="Invite by email" class="block w-full pl-10 pr-3 py-2.5 border border-slate-300 bg-slate-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                  </div>
                  <button (click)="addMember()" [disabled]="!newMemberEmail" class="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm">Invite</button>
                </div>

                <!-- Members list -->
                <div class="max-h-60 overflow-y-auto custom-scrollbar">
                  <ul class="divide-y divide-slate-100 pr-2">
                    <li *ngFor="let member of members" class="py-3 flex justify-between items-center group">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mr-3">
                          {{ member.userName.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <p class="text-sm font-bold text-slate-900">{{ member.userName }}</p>
                          <p class="text-xs text-slate-500">{{ member.role }}</p>
                        </div>
                      </div>
                      <button *ngIf="member.userId !== project?.createdById" (click)="removeMember(member.userId)" class="text-rose-500 hover:text-white hover:bg-rose-500 px-2 py-1 rounded transition-colors text-xs font-bold opacity-0 group-hover:opacity-100">Remove</button>
                      <span *ngIf="member.userId === project?.createdById" class="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200"><i class="fa-solid fa-crown text-amber-500 mr-1"></i> Owner</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-4 sm:px-6 border-t border-slate-100 text-right">
                <button type="button" (click)="showMemberModal = false" class="inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-6 py-2 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class TaskBoardComponent implements OnInit {
  projectId!: number;
  project: Project | null = null;
  tasks: TaskItem[] = [];
  members: ProjectMember[] = [];

  showCreateTaskModal = false;
  showMemberModal = false;

  newTask = { title: '', description: '', dueDate: '' };
  newMemberEmail = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
      if (this.projectId) {
        this.loadProjectDetails();
        this.loadTasks();
        if (this.authService.isAdmin()) {
          this.loadMembers();
        }
      }
    });
  }

  loadProjectDetails() {
    this.projectService.getProject(this.projectId).subscribe(data => this.project = data);
  }

  loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe(data => this.tasks = data);
  }

  loadMembers() {
    this.projectService.getMembers(this.projectId).subscribe(data => this.members = data);
  }

  getTasksByStatus(status: string) {
    return this.tasks.filter(t => t.status === status);
  }

  createTask() {
    const taskPayload = { ...this.newTask, projectId: this.projectId };
    this.taskService.createTask(taskPayload).subscribe(task => {
      this.tasks.push(task);
      this.showCreateTaskModal = false;
      this.newTask = { title: '', description: '', dueDate: '' };
    });
  }

  updateStatus(task: TaskItem, newStatus: string) {
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe(updatedTask => {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    });
  }

  addMember() {
    if (!this.newMemberEmail) return;
    this.projectService.addMember(this.projectId, this.newMemberEmail).subscribe({
      next: () => {
        this.loadMembers();
        this.newMemberEmail = '';
      },
      error: (err) => alert(err.error?.message || 'Error adding member')
    });
  }

  removeMember(userId: number) {
    if (confirm('Are you sure you want to remove this member?')) {
      this.projectService.removeMember(this.projectId, userId).subscribe(() => {
        this.loadMembers();
      });
    }
  }
}
