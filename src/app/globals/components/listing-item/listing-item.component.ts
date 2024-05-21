import { Component, Input, inject } from '@angular/core';
import { ListingDto } from '../../../types/listingDto.types';
import { MediaItem } from '../../../types/media.types';
import { NgIf } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HammerModule } from '@angular/platform-browser';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-listing-item',
  standalone: true,
  imports: [NgIf, ImageCropperModule, HammerModule, MaterialModule],
  templateUrl: './listing-item.component.html',
  styleUrls: ['./listing-item.component.scss']
})
export class ListingItemComponent {
  @Input() listingDto!: ListingDto;
  @Input() mediaList!: MediaItem[];
  desiredWidth = 300;
  desiredHeight = 200;
  currentImageIndex: number = 0;
  croppedImages: any[] = [];

  dialog=inject(MatDialog)

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
        const aspectRatio = image.width / image.height;
        let newWidth = 300;
        let newHeight = 200;
        if (aspectRatio > 1) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, newWidth, newHeight);
        }
        const data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }

  openImageDialog(index: number): void {
    const imageUrls = this.mediaList.map(media => media.imageUrl);
    const dialogData: DialogData = { images: imageUrls, currentIndex: index };
    this.dialog.open(ImageDialogComponent, { data: dialogData });
  }
}
