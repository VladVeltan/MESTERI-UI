import { Component, Input, inject, OnInit } from '@angular/core';
import { User } from '../../../types/user.types';
import { MaterialModule } from '../../modules/material.module';
import { MediaService } from '../../../servicies/media.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { categoryImages } from '../../../types/categoryImages.types';

@Component({
  selector: 'app-handyman-item',
  standalone: true,
  imports: [MaterialModule, NgIf, NgFor],
  templateUrl: './handyman-item.component.html',
  styleUrls: ['./handyman-item.component.scss']
})
export class HandymanItemComponent implements OnInit {
  @Input() handyman!: User;
  userProfilePicture: string = 'assets/profil.png'; // Default profile picture
  categories: { name: string, imageUrl: string }[] = []; // Array to hold categories and their images

  mediaService = inject(MediaService);
  router = inject(Router);

  ngOnInit() {
    this.loadUserProfilePicture(this.handyman.id);
    this.loadCategories();
  }

  loadUserProfilePicture(userId: string): void {
    this.mediaService.findMediaByTypeAndId('user_id', userId).subscribe((mediaItems) => {
      if (mediaItems.length > 0) {
        this.userProfilePicture = mediaItems[0].imageUrl;
      }
    });
  }

  loadCategories(): void {
    if (this.handyman.categoriesOfInterest) {
      const categoryList = this.handyman.categoriesOfInterest.split(',');
      this.categories = categoryList.map(category => ({
        name: category.trim(),
        imageUrl: categoryImages[category.trim()] || 'assets/default.png'
      }));
    }
  }

  navigateToUserProfile(email: string): void {
    this.router.navigate(['/profile', { email }]);
  }
}
