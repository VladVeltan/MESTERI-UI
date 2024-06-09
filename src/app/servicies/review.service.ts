import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewDto } from '../types/reviewDto.types';
import { environment } from '../types/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  http=inject(HttpClient)

  createReview(review: ReviewDto): Observable<ReviewDto> {
    console.log("in review service",review)
    return this.http.post<ReviewDto>(`${this.apiUrl}`, review);
  }
  getReviewsByHandymanEmail(handymanEmail: string): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/${handymanEmail}`);
  }
}
