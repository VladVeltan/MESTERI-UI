import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../types/environment/environment';
import { Listing } from '../types/listing.types';
import { PATHS } from '../globals/routes';
import { ListingDto } from '../types/listingDto.types';
import { Page } from '../types/page.types';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
    http=inject(HttpClient)
    
    postListing(formData: FormData): Observable<any> {
      return this.http.post<any>(`${environment.apiUrl}/listings`, formData, {
        headers: {
          'enctype': 'multipart/form-data'
        }
      });
    }
    
  
    getAllListings(): Observable<ListingDto[]> {
      return this.http.get<ListingDto[]>(`${environment.apiUrl}/${PATHS.LISTINGS}`);
    }

    getListingsByUserEmail(userEmail: string): Observable<ListingDto[]> {
      return this.http.get<ListingDto[]>(`${environment.apiUrl}/${PATHS.LISTINGS}/user/${userEmail}`);
    }
  
    getListingsWithSorting(fieldToSortBy: string): Observable<Listing[]> {
      return this.http.get<Listing[]>(`${environment.apiUrl}/${PATHS.LISTINGS}/sort/${fieldToSortBy}`);
    }
  
    getListingsWithPagination(offset: number, pageSize: number): Observable<Page<ListingDto>> {
      return this.http.get<Page<ListingDto>>(`${environment.apiUrl}/${PATHS.LISTINGS}/pagination/${offset}/${pageSize}`);
    }
   
    getListingsWithPaginationAndSorting(offset: number, pageSize: number, field: string): Observable<Page<ListingDto>> {
      return this.http.get<Page<ListingDto>>(`${environment.apiUrl}/${PATHS.LISTINGS}/pagination/sort/${offset}/${pageSize}/${field}`);
    }
  
    getListingById(listingId: string): Observable<Listing> {
      return this.http.get<Listing>(`${environment.apiUrl}/${PATHS.LISTINGS}/${listingId}`);
    }
  
    updateListing(newListingDto: ListingDto): Observable<ListingDto> {
      console.log(newListingDto)
      console.log(`${environment.apiUrl}/${PATHS.LISTINGS}`)
      return this.http.put<ListingDto>(`${environment.apiUrl}/${PATHS.LISTINGS}/update/update/update/update`, newListingDto);
    }
    
  
    deleteListing(listingId: string): Observable<string> {
      // console.log("Suntem in listing service", listingId);
      // console.log(`${environment.apiUrl}/${PATHS.LISTINGS}/${listingId}`);
      return this.http.delete<string>(`${environment.apiUrl}/${PATHS.LISTINGS}/${listingId}`, { responseType: 'text' as 'json' });
    }
    
  

    countAllListings(): Observable<number> {
      return this.http.get<number>(`${environment.apiUrl}/listings/count/count/count`);
    }


}
