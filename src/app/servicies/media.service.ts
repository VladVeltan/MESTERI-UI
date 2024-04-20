import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from '../types/media.types';
import { environment } from '../types/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  
  http=inject(HttpClient)

  findMediaByTypeAndId(idType: string, id: string): Observable<Media[]> {
    return this.http.get<Media[]>(`${environment.apiUrl}/${idType}/${id}`);
  }
  
}
