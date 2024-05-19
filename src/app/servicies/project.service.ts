import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../types/environment/environment';
import { Project } from '../types/project.types';
import { PATHS } from '../globals/routes';
import { ProjectDto } from '../types/projectDto.types';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  http=inject(HttpClient)

  postProject(project: Project): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${environment.apiUrl}/${PATHS.PROJECTS}`, project);
  }

  getAllProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${environment.apiUrl}/${PATHS.PROJECTS}`);
  }

  getProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/${PATHS.PROJECTS}/${projectId}`);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${environment.apiUrl}/${PATHS.PROJECTS}`, project);
  }

  deleteProject(projectId: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiUrl}/${PATHS.PROJECTS}/${projectId}`);
  }

  getAllProjectsWithSorting(fieldToSortBy: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/${PATHS.PROJECTS}/sort/${fieldToSortBy}`);
  }

  getAllProjectsWithPagination(offset: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${PATHS.PROJECTS}/pagination/${offset}/${pageSize}`);
  }

  getAllProjectsWithPaginationAndSorting(offset: number, pageSize: number, field: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${PATHS.PROJECTS}/pagination/sort/${offset}/${pageSize}/${field}`);
  }
}