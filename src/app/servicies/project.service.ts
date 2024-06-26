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

  postProject(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/projects`, formData, {
      headers: {
        'enctype': 'multipart/form-data'
      }
    });
  }
  

  getAllProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${environment.apiUrl}/${PATHS.PROJECTS}`);
  }

  getProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/${PATHS.PROJECTS}/${projectId}`);
  }

  getProjectsByUserEmail(userEmail: string): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${environment.apiUrl}/${PATHS.PROJECTS}/user/${userEmail}`);
  }

  updateProject(project: ProjectDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${environment.apiUrl}/${PATHS.PROJECTS}`, project);
  }
  

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${PATHS.PROJECTS}/${projectId}`,{ responseType: 'text' as 'json' });
  }

  getAllProjectsWithSorting(fieldToSortBy: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/${PATHS.PROJECTS}/sort/${fieldToSortBy}`);
  }

  getAllProjectsWithPagination(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${PATHS.PROJECTS}/pagination/${page}/${pageSize}`);
  }

  getAllProjectsWithPaginationAndSorting(page: number, pageSize: number, field: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${PATHS.PROJECTS}/pagination/sort/${page}/${pageSize}/${field}`);
  }

  countAllProjects(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/projects/count/count/count`);
  }
}
