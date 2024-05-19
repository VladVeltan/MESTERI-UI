import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bid } from '../types/bid.types';
import { PATHS } from '../globals/routes';
import { environment } from '../types/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  http=inject(HttpClient)

  postBid(bid:Bid): Observable<Bid> {
    return this.http.post<Bid>(`${environment.apiUrl}/${PATHS.BIDS}`, bid);
  }
  
  getBidsForProject(projectId: string): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${environment.apiUrl}/${PATHS.BIDS}/project/${projectId}`);
  }

}
