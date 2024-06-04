import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { ProjectDto } from '../../types/projectDto.types';
import { FilterSidebarComponent } from "../../globals/components/filter-sidebar/filter-sidebar.component";

import { SearchBarComponent } from '../../globals/components/search-bar/search-bar.component';
import { Category } from '../../types/category.types';
import { County } from '../../types/county.types';
import { ProjectService } from '../../servicies/project.service';
import { ProjectItemComponent } from '../../globals/components/project-item/project-item.component';
import { MediaService } from '../../servicies/media.service';
import { MediaItem } from '../../types/media.types';
import { jwtDecode } from 'jwt-decode';
import { FeedbackModalComponent } from '../../globals/components/feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  imports: [NgFor, NgIf, FilterSidebarComponent, ProjectItemComponent, SearchBarComponent,FeedbackModalComponent]
})
export class ProjectsPageComponent implements OnInit {
  @ViewChild(FeedbackModalComponent) feedbackModal!: FeedbackModalComponent;
  
  userEmail!:string;

  selectedCategoriesForFiltering: Category[] = [];
  selectedCountiesForFiltering: County[] = [];
  searchTerm: string = '';

  originalProjects: ProjectDto[] = [];
  filteredProjects: ProjectDto[] = [];
  mediaListMap: Map<string, MediaItem[]> = new Map();

  isCreateProjectModalOpen: boolean = false;
  noProjectsMessage: string = '';

  isFeedbackModalOpen: boolean = false;
  feedbackMessage: string = '';

  projectService = inject(ProjectService);
  mediaService = inject(MediaService);
  

  async ngOnInit(): Promise<void> {
    this.decodeToken();
    await this.getProjectsWithMedia();
    this.filterProjects(); // Initialize filtered projects
  }
  

  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
         this.userEmail= decodedToken.sub;
        console.log('Email-ul este:', this.userEmail);
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
  }
  
  async getProjectsWithMedia(): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects().toPromise();
      if (projects) {
        for (const project of projects) {
          const mediaList = await this.getMediaForProject(project.id);
          this.mediaListMap.set(project.id, mediaList);
          
        }
        this.originalProjects = projects;
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  async getMediaForProject(projectId: string): Promise<MediaItem[]> {
    try {
      const media = await this.mediaService.findMediaByTypeAndId('project_id', projectId).toPromise();
      return media || []; // Use the ternary operator to handle the case where media is undefined
    } catch (error) {
      console.error('Error fetching media for project:', error);
      return [];
    }
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterProjects();
  }

  filterProjects(): void {
    // If no filters are applied, display the original projects
    if (this.selectedCategoriesForFiltering.length === 0 &&
        this.selectedCountiesForFiltering.length === 0 &&
        this.searchTerm.length === 0) {
      this.filteredProjects = this.originalProjects;
      return;
    }

    // Filter projects based on category, county, and search term
    let filteredProjects = this.originalProjects.filter(project =>
      (this.selectedCategoriesForFiltering.length === 0 || 
       this.selectedCategoriesForFiltering.some(category => category.name === project.category.toString())) &&
      (this.selectedCountiesForFiltering.length === 0 || 
       this.selectedCountiesForFiltering.some(county => county.name === project.county.toString())) &&
      (this.searchTerm.length === 0 || 
       Object.values(project).some(value => value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())))
    );

    // Update the filtered projects
    this.filteredProjects = filteredProjects;

    // Construct the message for no projects found
    this.noProjectsMessage = this.constructNoProjectsMessage();
  }

  constructNoProjectsMessage(): string {
    let filters = [];

    if (this.selectedCategoriesForFiltering.length > 0) {
      const categories = this.selectedCategoriesForFiltering.map(category => category.name).join(', ');
      filters.push(`Categories: ${categories}`);
    }

    if (this.selectedCountiesForFiltering.length > 0) {
      const counties = this.selectedCountiesForFiltering.map(county => county.name).join(', ');
      filters.push(`Counties: ${counties}`);
    }

    if (this.searchTerm.length > 0) {
      filters.push(`Search Term: "${this.searchTerm}"`);
    }

    return filters.length > 0 ? `No projects found for the following filters: ${filters.join('; ')}` : '';
  }

  // Method to handle changes in selected categories
  onSelectedCategoriesChange(categories: Category[]): void {
    this.selectedCategoriesForFiltering = categories;
    this.filterProjects();
  }

  // Method to handle changes in selected counties
  onSelectedCountiesChange(counties: County[]): void {
    this.selectedCountiesForFiltering = counties;
    this.filterProjects();
  }

  openFeedbackModal(message: string): void {
    this.feedbackModal.showMessage(message);
  }

  closeFeedbackModal(): void {
    this.feedbackModal.hideModal();
  }

  showCompletionMessage(message: string): void {
    this.feedbackModal.showMessage(message);
    setTimeout(() => {
      this.feedbackModal.hideModal();
    }, 3000); // Adjust duration as needed
  }

  handleBidPlaced(message: string): void {
    this.showCompletionMessage(message);
  }





  

}
