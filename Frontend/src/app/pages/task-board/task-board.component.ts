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
    <div class="py-6 flex flex-col" style="min-height: calc(100vh - 5rem);">

      <!-- ─── Header ─── -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 flex-shrink-0 animate-fade-in-up">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="h-6 w-1 rounded-full" style="background: linear-gradient(180deg, #06b6d4, #6366f1);"></div>
            <p class="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Kanban Board</p>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {{ project?.name || 'Loading...' }}
            </h1>
            <span *ngIf="project"
                  class="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style="background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.2); color:#22d3ee;">
              ID #{{ project.id }}
            </span>
          </div>
          <p class="text-slate-400 text-sm mt-1.5">{{ tasks.length }} task{{ tasks.length !== 1 ? 's' : '' }} · Track your team's progress</p>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button *ngIf="authService.isAdmin()" (click)="showMemberModal = true" id="members-btn"
                  class="btn-secondary flex items-center gap-2 text-sm">
            <i class="fa-solid fa-users text-indigo-400 text-xs"></i>
            Team
          </button>
          <button *ngIf="authService.isAdmin()" (click)="showCreateTaskModal = true" id="add-task-btn"
                  class="btn-primary flex items-center gap-2 text-sm">
            <i class="fa-solid fa-plus text-xs"></i>
            Add Task
          </button>
        </div>
      </div>

      <!-- ─── Kanban Board ─── -->
      <div class="flex-1 flex flex-col md:flex-row gap-5 overflow-x-auto pb-8">

        <!-- ── TODO Column ── -->
        <div class="flex-1 min-w-[300px] max-w-sm flex flex-col rounded-2xl p-4 col-todo">
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-2.5">
              <div class="w-2.5 h-2.5 rounded-full animate-pulse-glow"
                   style="background:#fbbf24; box-shadow: 0 0 10px rgba(251,191,36,0.6);"></div>
              <h2 class="font-bold text-slate-200 text-sm uppercase tracking-wider">To Do</h2>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full badge-todo">
              {{ getTasksByStatus('Todo').length }}
            </span>
          </div>

          <!-- Tasks -->
          <div class="space-y-3 overflow-y-auto flex-1 pr-1 min-h-[200px]">
            <div *ngFor="let task of getTasksByStatus('Todo')"
                 class="task-card rounded-xl p-4 group relative overflow-hidden">
              <!-- Left accent -->
              <div class="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style="background:#fbbf24; opacity:0.6;"></div>

              <div class="flex items-start justify-between gap-2 pl-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-100 text-sm leading-snug truncate">{{ task.title }}</h3>
                  <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{{ task.description }}</p>
                </div>
                <!-- Quick action -->
                <button (click)="updateStatus(task, 'InProgress')"
                        class="opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/10"
                        style="color:#60a5fa;" title="Start Task">
                  <i class="fa-solid fa-circle-play text-sm"></i>
                </button>
              </div>

              <div class="mt-3 pt-3 border-t border-white/5 flex justify-between items-center pl-2">
                <div class="flex items-center gap-1.5 text-xs font-medium"
                     [class]="task.isOverdue ? 'badge-overdue px-2 py-0.5 rounded-md' : 'text-slate-500'">
                  <i class="fa-regular fa-calendar text-xs"></i>
                  {{ task.dueDate ? (task.dueDate | date:'MMM d') : 'No date' }}
                </div>
                <div *ngIf="task.assignedToName"
                     class="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md badge-todo">
                  <div class="avatar h-4 w-4 text-[9px]">{{ task.assignedToName.charAt(0) }}</div>
                  {{ task.assignedToName }}
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div *ngIf="getTasksByStatus('Todo').length === 0"
                 class="flex flex-col items-center justify-center py-10 text-center rounded-xl border-2 border-dashed"
                 style="border-color:rgba(251,191,36,0.15);">
              <i class="fa-regular fa-circle-check text-2xl mb-2" style="color:rgba(251,191,36,0.3);"></i>
              <p class="text-xs text-slate-600 font-medium">No pending tasks</p>
            </div>
          </div>
        </div>

        <!-- ── IN PROGRESS Column ── -->
        <div class="flex-1 min-w-[300px] max-w-sm flex flex-col rounded-2xl p-4 col-inprogress">
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-2.5">
              <div class="w-2.5 h-2.5 rounded-full animate-pulse"
                   style="background:#60a5fa; box-shadow: 0 0 10px rgba(96,165,250,0.6);"></div>
              <h2 class="font-bold text-slate-200 text-sm uppercase tracking-wider">In Progress</h2>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full badge-inprogress">
              {{ getTasksByStatus('InProgress').length }}
            </span>
          </div>

          <div class="space-y-3 overflow-y-auto flex-1 pr-1 min-h-[200px]">
            <div *ngFor="let task of getTasksByStatus('InProgress')"
                 class="task-card rounded-xl p-4 group relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style="background:#60a5fa;"></div>

              <!-- Subtle animated top shimmer -->
              <div class="absolute top-0 left-0 right-0 h-0.5 opacity-30"
                   style="background: linear-gradient(90deg, transparent, #60a5fa, transparent); animation: shimmer 2s linear infinite; background-size:200% 100%;"></div>

              <div class="flex items-start justify-between gap-2 pl-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-100 text-sm leading-snug truncate">{{ task.title }}</h3>
                  <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{{ task.description }}</p>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t border-white/5 flex justify-between items-center pl-2">
                <div class="flex items-center gap-1.5 text-xs font-medium"
                     [class]="task.isOverdue ? 'badge-overdue px-2 py-0.5 rounded-md' : 'text-slate-500'">
                  <i class="fa-regular fa-calendar text-xs"></i>
                  {{ task.dueDate ? (task.dueDate | date:'MMM d') : 'No date' }}
                </div>
                <div *ngIf="task.assignedToName"
                     class="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md badge-inprogress">
                  <div class="avatar h-4 w-4 text-[9px]">{{ task.assignedToName.charAt(0) }}</div>
                  {{ task.assignedToName }}
                </div>
              </div>

              <!-- Action buttons on hover -->
              <div
                   class="mt-3 pl-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button (click)="updateStatus(task, 'Todo')"
                        class="flex-1 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                        style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#94a3b8;">
                  <i class="fa-solid fa-rotate-left text-xs"></i> Pause
                </button>
                <button (click)="updateStatus(task, 'Completed')"
                        class="flex-1 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                        style="background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.2); color:#34d399;">
                  <i class="fa-solid fa-check text-xs"></i> Complete
                </button>
              </div>
            </div>

            <div *ngIf="getTasksByStatus('InProgress').length === 0"
                 class="flex flex-col items-center justify-center py-10 text-center rounded-xl border-2 border-dashed"
                 style="border-color:rgba(96,165,250,0.15);">
              <i class="fa-solid fa-bolt text-2xl mb-2" style="color:rgba(96,165,250,0.3);"></i>
              <p class="text-xs text-slate-600 font-medium">No active tasks</p>
            </div>
          </div>
        </div>

        <!-- ── COMPLETED Column ── -->
        <div class="flex-1 min-w-[300px] max-w-sm flex flex-col rounded-2xl p-4 col-done">
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-2.5">
              <div class="w-2.5 h-2.5 rounded-full"
                   style="background:#34d399; box-shadow: 0 0 10px rgba(52,211,153,0.6);"></div>
              <h2 class="font-bold text-slate-200 text-sm uppercase tracking-wider">Completed</h2>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full badge-done">
              {{ getTasksByStatus('Completed').length }}
            </span>
          </div>

          <div class="space-y-3 overflow-y-auto flex-1 pr-1 min-h-[200px]">
            <div *ngFor="let task of getTasksByStatus('Completed')"
                 class="rounded-xl p-4 group relative overflow-hidden transition-all duration-200 hover:border-emerald-500/20"
                 style="background:rgba(10,15,25,0.5); border:1px solid rgba(52,211,153,0.08);">
              <div class="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style="background:#34d399; opacity:0.5;"></div>

              <div class="flex items-start justify-between gap-2 pl-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-sm leading-snug line-through" style="color:#64748b; text-decoration-color:rgba(100,116,139,0.5);">
                    {{ task.title }}
                  </h3>
                  <p class="text-xs text-slate-600 mt-1 line-clamp-1">{{ task.description }}</p>
                </div>
                <button *ngIf="authService.isAdmin()" (click)="updateStatus(task, 'InProgress')"
                        class="opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center hover:bg-white/10 text-slate-600 hover:text-blue-400">
                  <i class="fa-solid fa-rotate-left text-xs"></i>
                </button>
              </div>

              <div class="mt-3 pt-3 border-t border-white/[0.04] flex justify-between items-center pl-2">
                <span class="badge-done text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <i class="fa-solid fa-check-double text-xs"></i> Done
                </span>
                <span *ngIf="task.assignedToName" class="text-xs text-slate-600 font-medium">
                  {{ task.assignedToName }}
                </span>
              </div>
            </div>

            <div *ngIf="getTasksByStatus('Completed').length === 0"
                 class="flex flex-col items-center justify-center py-10 text-center rounded-xl border-2 border-dashed"
                 style="border-color:rgba(52,211,153,0.15);">
              <i class="fa-solid fa-trophy text-2xl mb-2" style="color:rgba(52,211,153,0.3);"></i>
              <p class="text-xs text-slate-600 font-medium">Nothing done yet</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Create Task Modal ─── -->
      <div *ngIf="showCreateTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-md" (click)="showCreateTaskModal = false"></div>

        <div class="relative w-full max-w-md z-10 animate-fade-in-up">
          <div class="absolute -inset-0.5 rounded-2xl opacity-50"
               style="background: linear-gradient(135deg, rgba(99,102,241,0.5), rgba(6,182,212,0.3)); filter:blur(8px);"></div>

          <div class="relative glass-modal rounded-2xl p-7">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl flex items-center justify-center"
                     style="background: linear-gradient(135deg, #6366f1, #06b6d4); box-shadow:0 0 20px rgba(99,102,241,0.4);">
                  <i class="fa-solid fa-list-check text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Add New Task</h3>
                  <p class="text-xs text-slate-500">Add a task to the board</p>
                </div>
              </div>
              <button (click)="showCreateTaskModal = false"
                      class="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div class="space-y-4 mb-6">
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Title</label>
                <input type="text" [(ngModel)]="newTask.title" id="new-task-title"
                       placeholder="e.g. Design login page"
                       class="input-dark text-sm">
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea [(ngModel)]="newTask.description" rows="3"
                          placeholder="Task details and requirements..."
                          class="input-dark text-sm resize-none"
                          style="resize:none;"></textarea>
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-regular fa-calendar text-slate-500 text-sm"></i>
                  </div>
                  <input type="date" [(ngModel)]="newTask.dueDate"
                         class="input-dark text-sm" style="padding-left:2.75rem;">
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button (click)="showCreateTaskModal = false" class="btn-secondary flex-1 text-sm">Cancel</button>
              <button (click)="createTask()" id="confirm-add-task"
                      [disabled]="!newTask.title.trim()"
                      class="btn-primary flex-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                <i class="fa-solid fa-plus mr-2 text-xs"></i>
                Save Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Members Modal ─── -->
      <div *ngIf="showMemberModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-md" (click)="showMemberModal = false"></div>

        <div class="relative w-full max-w-md z-10 animate-fade-in-up">
          <div class="absolute -inset-0.5 rounded-2xl opacity-50"
               style="background: linear-gradient(135deg, rgba(139,92,246,0.5), rgba(99,102,241,0.3)); filter:blur(8px);"></div>

          <div class="relative glass-modal rounded-2xl p-7">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl flex items-center justify-center"
                     style="background: linear-gradient(135deg, #8b5cf6, #6366f1); box-shadow:0 0 20px rgba(139,92,246,0.4);">
                  <i class="fa-solid fa-users text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Manage Team</h3>
                  <p class="text-xs text-slate-500">{{ members.length }} member{{ members.length !== 1 ? 's' : '' }} in this project</p>
                </div>
              </div>
              <button (click)="showMemberModal = false"
                      class="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <!-- Invite form -->
            <div class="space-y-1.5 mb-5">
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Invite by Email</label>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-regular fa-envelope text-slate-500 text-sm"></i>
                  </div>
                  <input type="email" [(ngModel)]="newMemberEmail" id="member-email"
                         placeholder="colleague@company.com"
                         class="input-dark text-sm" style="padding-left:2.75rem;"
                         (keyup.enter)="addMember()">
                </div>
                <button (click)="addMember()" [disabled]="!newMemberEmail"
                        class="btn-primary text-sm flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none px-4">
                  Invite
                </button>
              </div>
            </div>

            <!-- Divider -->
            <div class="divider mb-5"></div>

            <!-- Members list -->
            <div class="max-h-64 overflow-y-auto space-y-2 pr-1">
              <div *ngFor="let member of members"
                   class="flex items-center justify-between py-2.5 px-3 rounded-xl group transition-all duration-200 hover:bg-white/[0.03]">
                <div class="flex items-center gap-3">
                  <div class="avatar h-9 w-9 text-sm flex-shrink-0">
                    {{ member.userName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-200">{{ member.userName }}</p>
                    <p class="text-xs font-medium"
                       [style]="member.role === 'Admin' ? 'color:#fbbf24' : 'color:#64748b'">
                      {{ member.role }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span *ngIf="member.userId === project?.createdById"
                        class="text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        style="background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.2); color:#fbbf24;">
                    <i class="fa-solid fa-crown text-xs"></i> Owner
                  </span>
                  <button *ngIf="member.userId !== project?.createdById"
                          (click)="removeMember(member.userId)"
                          class="opacity-0 group-hover:opacity-100 transition-all text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#f87171;">
                    Remove
                  </button>
                </div>
              </div>

              <div *ngIf="members.length === 0" class="text-center py-8 text-slate-600 text-sm">
                No members yet. Invite someone above!
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-white/5 text-right">
              <button (click)="showMemberModal = false" class="btn-secondary text-sm">
                Done
              </button>
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
        if (this.authService.isAdmin()) this.loadMembers();
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
    const payload = { ...this.newTask, projectId: this.projectId };
    this.taskService.createTask(payload).subscribe(task => {
      this.tasks.push(task);
      this.showCreateTaskModal = false;
      this.newTask = { title: '', description: '', dueDate: '' };
    });
  }

  updateStatus(task: TaskItem, newStatus: string) {
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe(updated => {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) this.tasks[index] = updated;
    });
  }

  addMember() {
    if (!this.newMemberEmail) return;
    this.projectService.addMember(this.projectId, this.newMemberEmail).subscribe({
      next: () => { this.loadMembers(); this.newMemberEmail = ''; },
      error: (err) => alert(err.error?.message || 'Error adding member')
    });
  }

  removeMember(userId: number) {
    if (confirm('Remove this member from the project?')) {
      this.projectService.removeMember(this.projectId, userId).subscribe(() => this.loadMembers());
    }
  }
}
