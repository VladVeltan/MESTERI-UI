import { Component,Input } from '@angular/core';
import { Listing } from '../../../types/listing.types';
import { Media, MediaItem } from '../../../types/media.types';
import { NgIf } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { HammerModule } from '@angular/platform-browser';

@Component({
  selector: 'app-listing-item',
  standalone: true,
  imports: [NgIf,ImageCropperModule,HammerModule],
  templateUrl: './listing-item.component.html',
  styleUrl: './listing-item.component.scss'
})
export class ListingItemComponent {
  @Input() listing!: Listing;
  @Input() mediaList!: MediaItem[];
  desiredWidth = 300; // Definește lățimea dorită a imaginii redimensionate
  desiredHeight = 200;
  currentImageIndex: number = 0;
  croppedImages: any[] = [];

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
  
  ngOnInit(): void {
    this.resizeMediaImages();
  }

  async resizeMediaImages(): Promise<void> {
    for (let i = 0; i < this.mediaList.length; i++) {
      const resizedImage = await this.resizeImage(this.mediaList[i].imageUrl);
      this.mediaList[i].imageUrl = resizedImage;
    }
  }

  resizeImage(imageURL: any): Promise<string> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        
        // Calculează raportul de aspect al imaginii inițiale
        const aspectRatio = image.width / image.height;
  
        // Ajustează dimensiunile dorite în funcție de raportul de aspect
        let newWidth = 300;
        let newHeight = 200;
        if (aspectRatio > 1) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
  
        canvas.width = newWidth; // Lățimea dorită
        canvas.height = newHeight; // Înălțimea dorită
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, newWidth, newHeight); // Redimensionare la dimensiunile dorite
        }
        const data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }
  
}
