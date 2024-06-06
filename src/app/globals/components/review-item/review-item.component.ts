import { Component, Input } from '@angular/core';
import { ReviewDto } from '../../../types/reviewDto.types';
import { MaterialModule } from '../../modules/material.module';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [MaterialModule,NgFor,NgIf,CommonModule],
  templateUrl: './review-item.component.html',
  styleUrl: './review-item.component.scss'
})
export class ReviewItemComponent {
  @Input() review!: ReviewDto;

  getStars(mark: number): string[] {
    const fullStars = Math.floor(mark);
    const halfStar = mark % 1 >= 0.5 ? 'star_half' : '';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return [
      ...Array(fullStars).fill('star'),
      ...(halfStar ? [halfStar] : []),
      ...Array(emptyStars).fill('star_border')
    ];
  }
}
