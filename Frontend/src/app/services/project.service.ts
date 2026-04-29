import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  name: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  memberCount: number;
  taskCount: number;
}

export interface ProjectMember {
  userId: number;
  userName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(name: string): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, { name });
  }

  getMembers(projectId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/${projectId}/members`);
  }

  addMember(projectId: number, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/members`, { email });
  }

  removeMember(projectId: number, memberId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/members/${memberId}`);
  }
}
