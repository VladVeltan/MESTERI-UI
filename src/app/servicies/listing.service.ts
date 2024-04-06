import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../types/environment/environment';
import { Listing } from '../types/listing.types';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
    http=inject(HttpClient)
    
    postListing(listing:Listing):Observable<Listing>{
      return this.http.post<Listing>(environment.apiUrl+'/listings',listing)
    }
  
    getAllListings():Observable<Listing[]>{
      return this.http.get<Listing[]>(environment.apiUrl+'/listings')
  }

  
}
