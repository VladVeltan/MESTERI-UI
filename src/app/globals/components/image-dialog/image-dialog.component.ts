import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../modules/material.module';


export interface DialogData {
  images: string[];
  currentIndex: number;
}

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.scss'
})
export class ImageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  navigateToPreviousImage(): void {
    if (this.data.currentIndex > 0) {
      this.data.currentIndex--;
    }
  }

  navigateToNextImage(): void {
    if (this.data.currentIndex < this.data.images.length - 1) {
      this.data.currentIndex++;
    }
  }
}