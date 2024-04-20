import { Component,Input } from '@angular/core';
import { Listing } from '../../../types/listing.types';
import { Media } from '../../../types/media.types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-listing-item',
  standalone: true,
  imports: [NgIf],
  templateUrl: './listing-item.component.html',
  styleUrl: './listing-item.component.scss'
})
export class ListingItemComponent {
  @Input() listing!: Listing;
  @Input() mediaList!: Media[];

  currentImageIndex: number = 0;

  navigateToNextImage(): void {
    if (this.mediaList && this.currentImageIndex < this.mediaList.length - 1) {
      this.currentImageIndex++;
    }
  }

  navigateToPreviousImage(): void {
    if (this.mediaList && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
}
