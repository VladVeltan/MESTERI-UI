import { Component, Input, inject } from '@angular/core';
import { User } from '../../../types/user.types';
import { MaterialModule } from '../../modules/material.module';
import { MediaService } from '../../../servicies/media.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-handyman-item',
  standalone: true,
  imports:[MaterialModule,NgIf],
  templateUrl: './handyman-item.component.html',
  styleUrls: ['./handyman-item.component.scss']
})
export class HandymanItemComponent {
  @Input() handyman!: User;
  userProfilePicture: string = 'assets/profil.png'; // Default profile picture
  
  mediaService = inject(MediaService);
  router = inject(Router);
  
  ngOnInit(){
    this.loadUserProfilePicture(this.handyman.id);
  }
  loadUserProfilePicture(userId: string): void {
    this.mediaService.findMediaByTypeAndId('user_id', userId).subscribe((mediaItems) => {
      if (mediaItems.length > 0) {
        this.userProfilePicture = mediaItems[0].imageUrl;
      }
    });
  }
  navigateToUserProfile(email: string): void {
    this.router.navigate(['/profile', { email }]);
  }
}
