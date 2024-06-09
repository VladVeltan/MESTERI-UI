import { Component, Input, inject } from '@angular/core';
import { ListingDto } from '../../../types/listingDto.types';
import { MediaItem } from '../../../types/media.types';
import { NgIf } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HammerModule } from '@angular/platform-browser';
import { MaterialModule } from '../../modules/material.module';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-listing-item',
  standalone: true,
  imports: [NgIf, ImageCropperModule, HammerModule, MaterialModule,ImageModalComponent],
  templateUrl: './listing-item.component.html',
  styleUrls: ['./listing-item.component.scss'],
  providers: [DatePipe]
})
export class ListingItemComponent {
  @Input() listingDto!: ListingDto;
  @Input() mediaList!: MediaItem[];
  desiredWidth = 300;
  desiredHeight = 200;
  currentImageIndex: number = 0;
  showImageModal: boolean = false;

  datePipe = inject(DatePipe);
  router = inject(Router);

  openImageModal(index: number): void {
    this.currentImageIndex = index;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
  }

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

  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy')!;
  }

  getFormattedTime(date: string): string {
    return this.datePipe.transform(date, 'HH:mm')!;
  }

  navigateToUserProfile(email: string): void {
    this.router.navigate(['/profile', { email }]);
  }
}
