import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../servicies/listing.service';
import { ProjectService } from '../../servicies/project.service';
import { ListingDto } from '../../types/listingDto.types';
import { ProjectDto } from '../../types/projectDto.types';
import { NgFor } from '@angular/common';
import { ListingItemComponent } from '../../globals/components/listing-item/listing-item.component';
import { ProjectItemComponent } from '../../globals/components/project-item/project-item.component';
import { jwtDecode } from 'jwt-decode';
import { MediaService } from '../../servicies/media.service';
import { MediaItem } from '../../types/media.types';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NgFor,ListingItemComponent,ProjectItemComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  userListings: ListingDto[] = [];
  userProjects: ProjectDto[] = [];
  mediaListMap: Map<string, MediaItem[]> = new Map();
  userEmail: string = '';

  constructor(
    private listingService: ListingService,
    private projectService: ProjectService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.decodeToken();
    this.loadUserListings();
    this.loadUserProjects();
  }

  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
        this.userEmail = decodedToken.sub;
        console.log('Email-ul este:', this.userEmail);
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
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
    // Implementare pentru editarea unui anunț
  }

  deleteListing(listingId: string): void {
    console.log(listingId)
    this.listingService.deleteListing(listingId).subscribe(() => {
      this.loadUserListings();
    });
  }

  editProject(project: ProjectDto): void {
    // Implementare pentru editarea unui proiect
  }

  deleteProject(projectId: string): void {
    this.projectService.deleteProject(projectId).subscribe(() => {
      this.loadUserProjects();
    });
  }
}
