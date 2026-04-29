import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  assignedToId?: number;
  assignedToName?: string;
  status: string;
  dueDate?: string;
  createdAt: string;
  isOverdue: boolean;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getTasksByProject(projectId: number): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createTask(task: any): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task);
  }

  updateTaskStatus(taskId: number, status: string): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${taskId}/status`, { status });
  }

  assignTask(taskId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/assign`, { userId });
  }
}
