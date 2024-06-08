import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
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
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  imports: [NgFor, NgIf, FilterSidebarComponent, ProjectItemComponent, SearchBarComponent, FeedbackModalComponent, FormsModule]
})
export class ProjectsPageComponent implements OnInit {
  @ViewChild(FeedbackModalComponent) feedbackModal!: FeedbackModalComponent;

  userEmail!: string;
  numberOfProjects: number = 0;
  selectedCategoriesForFiltering: Category[] = [];
  selectedCountiesForFiltering: County[] = [];
  searchTerm: string = '';

  originalProjects: ProjectDto[] = [];
  filteredProjects: ProjectDto[] = [];
  paginatedProjects: ProjectDto[] = [];
  mediaListMap: Map<string, MediaItem[]> = new Map();

  isCreateProjectModalOpen: boolean = false;
  noProjectsMessage: string = '';

  isFeedbackModalOpen: boolean = false;
  feedbackMessage: string = '';

  projectService = inject(ProjectService);
  mediaService = inject(MediaService);

  // Pagination variables
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;

  pageSizeOptions = [5, 10, 20, 50];

  // Sorting variables
  selectedSortOption: string = 'default';

  async ngOnInit(): Promise<void> {
    this.projectService.countAllProjects().subscribe({
      next: count => {
        this.numberOfProjects = count;
        this.totalPages = Math.ceil(this.numberOfProjects / this.pageSize);
      },
      error: err => {
        console.error('Error fetching project count', err);
      }
    });
    this.decodeToken();
    await this.loadProjectsPage();
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

  async loadProjectsPage(): Promise<void> {
    try {
      const paginatedProjects = await this.projectService.getAllProjectsWithPagination(this.currentPage, this.pageSize).toPromise();
      if (paginatedProjects) {
        const activeProjects = paginatedProjects.content.filter((project: ProjectDto) => project.status);
        for (const project of activeProjects) {
          const mediaList = await this.getMediaForProject(project.id);
          this.mediaListMap.set(project.id, mediaList);
        }
        this.originalProjects = activeProjects;
        this.filterProjects();
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
    this.currentPage = 0; // Reset to the first page on search
    this.filterProjects();
  }

  filterProjects(): void {
    if (
      this.selectedCategoriesForFiltering.length === 0 &&
      this.selectedCountiesForFiltering.length === 0 &&
      this.searchTerm.length === 0
    ) {
      this.filteredProjects = this.originalProjects;
    } else {
      const filteredProjects = this.originalProjects.filter((project) =>
        project.status &&
        (this.selectedCategoriesForFiltering.length === 0 ||
          this.selectedCategoriesForFiltering.some((category) => category.name === (project.category ? project.category.toString() : ''))) &&
        (this.selectedCountiesForFiltering.length === 0 ||
          this.selectedCountiesForFiltering.some((county) => county.name === (project.county ? project.county.toString() : ''))) &&
        (this.searchTerm.length === 0 ||
          Object.values(project).some((value) => value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())))
      );
      this.filteredProjects = filteredProjects;
    }
    this.sortProjects();
    this.paginateProjects();
    this.noProjectsMessage = this.constructNoProjectsMessage();
  }

  sortProjects(): void {
    if (this.selectedSortOption === 'date') {
      this.filteredProjects.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    } else if (this.selectedSortOption === 'actionDuration') {
      this.filteredProjects.sort((a, b) => this.getRemainingBiddingTime(b.creationDate, b.actionDuration) - this.getRemainingBiddingTime(a.creationDate, a.actionDuration));
    }
  }

  getRemainingBiddingTime(creationDate: string, actionDuration: number): number {
    const creation = new Date(creationDate);
    const now = new Date();
    const end = new Date(creation.getTime() + actionDuration * 24 * 60 * 60 * 1000); // assuming actionDuration is in days
    return end.getTime() - now.getTime();
  }

  paginateProjects(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProjects = this.filteredProjects.slice(start, end);
  }

  onSelectedCategoriesChange(categories: Category[]): void {
    this.selectedCategoriesForFiltering = categories;
    this.currentPage = 0; // Reset to the first page on filter change
    this.filterProjects();
  }

  onSelectedCountiesChange(counties: County[]): void {
    this.selectedCountiesForFiltering = counties;
    this.currentPage = 0; // Reset to the first page on filter change
    this.filterProjects();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateProjects();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to the first page on page size change
    this.totalPages = Math.ceil(this.filteredProjects.length / this.pageSize);
    this.paginateProjects();
  }

  onSortOptionChange(sortOption: string): void {
    this.selectedSortOption = sortOption;
    this.currentPage = 0; // Reset to the first page on sort change
    this.filterProjects();
  }

  constructNoProjectsMessage(): string {
    let filters = [];

    if (this.selectedCategoriesForFiltering.length > 0) {
      const categories = this.selectedCategoriesForFiltering.map(category => category.name).join(', ');
      filters.push(`Categoria: ${categories}`);
    }

    if (this.selectedCountiesForFiltering.length > 0) {
      const counties = this.selectedCountiesForFiltering.map(county => county.name).join(', ');
      filters.push(`Judetul: ${counties}`);
    }

    if (this.searchTerm.length > 0) {
      filters.push(`Termentul de cautare: "${this.searchTerm}"`);
    }

    return filters.length > 0 ? `Nu s-au gasit proiecte pentru urmatoarele filtre: ${filters.join('; ')}` : '';
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
