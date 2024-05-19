import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Media, MediaItem } from '../types/media.types';
import { environment } from '../types/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  
  http=inject(HttpClient)

  findMediaByTypeAndId2(idType: string, id: string): Observable<Media[]> {
    return this.http.get<Media[]>(`${environment.apiUrl}/medias/${idType}/${id}`);
  }


  findMediaByTypeAndId(idType: string, id: string): Observable<MediaItem[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/medias/${idType}/${id}`).pipe(
      map((data: any[]) => {
        return data.map(item => {
          const blob = new Blob([this.base64ToArrayBuffer(item)], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          return { id: item.id, imageUrl: imageUrl };
        });
      })
    );
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }


  uploadMedia(whichEntity: string, entityId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return this.http.post<any>(`${environment.apiUrl}/medias/${whichEntity}/${entityId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
