import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../types/environment/environment';
import { Listing } from '../types/listing.types';
import { PATHS } from '../globals/routes';
import { ListingDto } from '../types/listingDto.types';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
    http=inject(HttpClient)
    
    postListing(listingDto: ListingDto): Observable<ListingDto> {
      return this.http.post<ListingDto>(`${environment.apiUrl}/${PATHS.LISTINGS}`, listingDto);
    }
  
    getAllListings(): Observable<Listing[]> {
      return this.http.get<Listing[]>(`${environment.apiUrl}/${PATHS.LISTINGS}`);
    }
  
    getListingsWithSorting(fieldToSortBy: string): Observable<Listing[]> {
      return this.http.get<Listing[]>(`${environment.apiUrl}/${PATHS.LISTINGS}/sort/${fieldToSortBy}`);
    }
  
    getListingsWithPagination(offset: number, pageSize: number): Observable<Listing[]> {
      return this.http.get<Listing[]>(`${environment.apiUrl}/${PATHS.LISTINGS}/pagination/${offset}/${pageSize}`);
    }
  
    getListingsWithPaginationAndSorting(offset: number, pageSize: number, field: string): Observable<Listing[]> {
      return this.http.get<Listing[]>(`${environment.apiUrl}/${PATHS.LISTINGS}/pagination/sort/${offset}/${pageSize}/${field}`);
    }
  
    getListingById(listingId: string): Observable<Listing> {
      return this.http.get<Listing>(`${environment.apiUrl}/${PATHS.LISTINGS}/${listingId}`);
    }
  
    updateListing(listing: Listing): Observable<Listing> {
      return this.http.put<Listing>(`${environment.apiUrl}/${PATHS.LISTINGS}`, listing);
    }
  
    deleteListing(id: string): Observable<string> {
      return this.http.delete<string>(`${environment.apiUrl}/${PATHS.LISTINGS}/${id}`);
    }



}
