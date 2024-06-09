import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaItem } from '../../../types/media.types';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss'
})
export class ImageModalComponent {
  @Input() mediaList: MediaItem[] = [];
  @Input() currentIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  nextImage(): void {
    if (this.currentIndex < this.mediaList.length - 1) {
      this.currentIndex++;
    }
  }

  previousImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
