import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../modules/material.module';
import { MediaItem } from '../../../types/media.types';

export interface DialogData {
  mediaList: MediaItem[];
  currentIndex: number;
}

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {
  mediaList: MediaItem[];
  currentIndex: number;

  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mediaList = data.mediaList;
    this.currentIndex = data.currentIndex;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  navigateToNextImage(): void {
    if (this.currentIndex < this.mediaList.length - 1) {
      this.currentIndex++;
    }
  }

  navigateToPreviousImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
