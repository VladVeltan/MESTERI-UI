import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule, NgModel } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { ReviewService } from '../../../servicies/review.service';
import { ListingService } from '../../../servicies/listing.service';
import { ProjectService } from '../../../servicies/project.service';
import { ReviewDto } from '../../../types/reviewDto.types';
import { ListingDto } from '../../../types/listingDto.types';
import { ProjectDto } from '../../../types/projectDto.types';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [MaterialModule, FormsModule, NgFor,NgClass],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss'
})
export class ReviewModalComponent implements OnInit {
  review: ReviewDto = {
    userEmail: '',
    handymanEmail: '',
    mark: 0,
    message: '',
    project_id: null,
    listing_id: null,
    createdAt:new Date().toISOString(),
    userFirstName:'',
    userLastName:'',
    postTitle:''
  };
  stars = [1, 2, 3, 4, 5];
  hoveredRating: number | null = null;
  userListings: ListingDto[] = [];
  userProjects: ProjectDto[] = [];
  selectedItem: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userEmail: string, handymanEmail: string },
    private reviewService: ReviewService,
    private listingService: ListingService,
    private projectService: ProjectService
  ) {
    this.review.handymanEmail = data.handymanEmail;
  }

  ngOnInit(): void {
    this.decodeToken();
    this.loadUserListings();
    this.loadUserProjects();
  }
  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
        this.review.userEmail = decodedToken.sub;
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
  }

  loadUserListings(): void {
    this.listingService.getListingsByUserEmail(this.review.userEmail).subscribe((listings) => {
      this.userListings = listings;
    });
  }

  loadUserProjects(): void {
    this.projectService.getProjectsByUserEmail(this.review.userEmail).subscribe((projects) => {
      this.userProjects = projects;
    });
  }

  setRating(rating: number): void {
    this.review.mark = rating;
  }

  highlightStars(rating: number): void {
    this.hoveredRating = rating;
  }

  resetStars(): void {
    this.hoveredRating = null;
  }

  getStarIcon(index: number): string {
    const rating = this.hoveredRating ?? this.review.mark;
    if (index < rating - 0.5) {
      return 'star';
    } else if (index < rating) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  isHalfFilled(index: number): boolean {
    const rating = this.hoveredRating ?? this.review.mark;
    return index < rating && index >= rating - 0.5;
  }

  isFormValid(): boolean {
    return this.review.mark > 0 && this.selectedItem !== '';
  }

  submitReview(): void {
    console.log(this.review.createdAt)
    if (this.selectedItem) {
      const isListing = this.userListings.some(listing => listing.id === this.selectedItem);
      if (isListing) {
        this.review.listing_id = this.selectedItem;
        this.review.project_id = null;
      } else {
        this.review.project_id = this.selectedItem;
        this.review.listing_id = null;
      }

      console.log('Review submitted:', this.review);
      this.reviewService.createReview(this.review).subscribe({
        next: (response) => {
          console.log('Review submitted successfully:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
