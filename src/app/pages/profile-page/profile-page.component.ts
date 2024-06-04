import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../servicies/listing.service';
import { ProjectService } from '../../servicies/project.service';
import { jwtDecode } from 'jwt-decode';
import { MediaService } from '../../servicies/media.service';
import { UserService } from '../../servicies/user.service';
import { ListingDto } from '../../types/listingDto.types';
import { ProjectDto } from '../../types/projectDto.types';
import { MediaItem } from '../../types/media.types';
import { User } from '../../types/user.types';
import { NgFor, NgIf } from '@angular/common';
import { ListingItemComponent } from '../../globals/components/listing-item/listing-item.component';
import { ProjectItemComponent } from '../../globals/components/project-item/project-item.component';
import { MaterialModule } from '../../globals/modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from '../../globals/components/review-modal/review-modal.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NgFor,NgIf, ListingItemComponent, ProjectItemComponent, MaterialModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userListings: ListingDto[] = [];
  userProjects: ProjectDto[] = [];
  mediaListMap: Map<string, MediaItem[]> = new Map();
  userEmail: string = '';
  userProfilePicture: string = 'assets/profil.png'; // Default profile picture
  user!: User;
  isCurrentUser: boolean = false; // Flag to check if the profile belongs to the current user

  route = inject(ActivatedRoute);
  userService = inject(UserService);
  listingService = inject(ListingService);
  projectService = inject(ProjectService);
  mediaService = inject(MediaService);
  dialog = inject(MatDialog); // Inject MatDialog

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['email']) {
        this.userEmail = params['email'];
        this.checkIfCurrentUser();
        this.loadUserData();
      } else {
        this.decodeToken();
        this.checkIfCurrentUser();
        this.loadUserData();
      }
    });
    this.loadUserListings();
    this.loadUserProjects();
  }

  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
        this.userEmail = decodedToken.sub;
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
  }

  checkIfCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.isCurrentUser = decodedToken.sub === this.userEmail;
    }
  }

  loadUserData(): void {
    this.userService.findUserByEmail(this.userEmail).subscribe((user) => {
      this.user = user;
      this.loadUserProfilePicture(user.id);
    });
  }

  loadUserProfilePicture(userId: string): void {
    this.mediaService.findMediaByTypeAndId('user_id', userId).subscribe((mediaItems) => {
      if (mediaItems.length > 0) {
        this.userProfilePicture = mediaItems[0].imageUrl;
      }
    });
  }

  loadUserListings(): void {
    this.listingService.getListingsByUserEmail(this.userEmail).subscribe((listings) => {
      this.userListings = listings;
      this.loadMediaForListings();
    });
  }

  loadMediaForListings(): void {
    for (const listing of this.userListings) {
      this.mediaService.findMediaByTypeAndId('listing_id', listing.id).subscribe((mediaItems) => {
        this.mediaListMap.set(listing.id, mediaItems);
      });
    }
  }

  loadUserProjects(): void {
    this.projectService.getProjectsByUserEmail(this.userEmail).subscribe((projects) => {
      this.userProjects = projects;
      this.loadMediaForProjects();
    });
  }

  loadMediaForProjects(): void {
    for (const project of this.userProjects) {
      this.mediaService.findMediaByTypeAndId('project_id', project.id).subscribe((mediaItems) => {
        this.mediaListMap.set(project.id, mediaItems);
      });
    }
  }

  editListing(listing: ListingDto): void {
    // Implement listing editing logic
  }

  deleteListing(listingId: string): void {
    this.listingService.deleteListing(listingId).subscribe(() => {
      this.loadUserListings();
    });
  }

  editProject(project: ProjectDto): void {
    // Implement project editing logic
  }

  deleteProject(projectId: string): void {
    // this.projectService.deleteProject(projectId).subscribe(() => {
    //   this.loadUserProjects();
    // });
    
  }

  editUserDetails(): void {
    // Implement user details editing logic
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.mediaService.updateMedia('user_id', this.user.id, file).subscribe({
        next: () => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.userProfilePicture = e.target.result;
          };
          reader.readAsDataURL(file);
          console.log('Profile picture updated successfully');
        },
        error: (err) => {
          console.error('Failed to update profile picture:', err);
        }
      });
    }
  }

  changeProfilePicture(): void {
    this.triggerFileInput();
  }
  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 'star_half' : '';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return [
      ...Array(fullStars).fill('star'),
      ...(halfStar ? [halfStar] : []),
      ...Array(emptyStars).fill('star_border')
    ];
  }

  leaveReview(): void {
    const dialogRef = this.dialog.open(ReviewModalComponent, {
      data: { userId: this.user.id },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Review submitted:', result);
        // Handle the review submission logic here
      }
    });
  }
  
  
}
