import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule, NgModel } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [MaterialModule,FormsModule,NgFor],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss'
})
export class ReviewModalComponent {
  review = { rating: 0, comment: '' };
  stars = [1, 2, 3, 4, 5];
  hoveredRating: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {}

  setRating(rating: number): void {
    this.review.rating = rating;
  }

  highlightStars(rating: number): void {
    this.hoveredRating = rating;
  }

  resetStars(): void {
    this.hoveredRating = null;
  }

  getStarIcon(index: number): string {
    const rating = this.hoveredRating ?? this.review.rating;
    if (index < rating - 0.5) {
      return 'star';
    } else if (index < rating) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  isHalfFilled(index: number): boolean {
    const rating = this.hoveredRating ?? this.review.rating;
    return index < rating && index >= rating - 0.5;
  }

  submitReview(): void {
    console.log('Review submitted:', this.review);
    this.dialogRef.close(this.review);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}