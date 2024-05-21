import { Component, OnInit, inject } from '@angular/core';
import { ListingService } from '../../servicies/listing.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingDto } from '../../types/listingDto.types';
import { FilterSidebarComponent } from "../../globals/components/filter-sidebar/filter-sidebar.component";
import { ListingItemComponent } from '../../globals/components/listing-item/listing-item.component';
import { SearchBarComponent } from '../../globals/components/search-bar/search-bar.component';
import { MediaService } from '../../servicies/media.service';
import { MediaItem } from '../../types/media.types';
import { Category } from '../../types/category.types';
import { County } from '../../types/county.types';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  templateUrl: './listings-page.component.html',
  styleUrl: './listings-page.component.scss',
  imports: [CommonModule, FormsModule, NgFor, NgIf, FilterSidebarComponent, ListingItemComponent, SearchBarComponent]
})
export class ListingsPageComponent implements OnInit {

  selectedCategoriesForFiltering: Category[] = [];
  selectedCountiesForFiltering: County[] = [];
  searchTerm: string = '';

  originalListings: ListingDto[] = [];
  filteredListings: ListingDto[] = [];
  mediaListMap: Map<string, MediaItem[]> = new Map()

  isCreateListingModalOpen: boolean = false;
  noListingsMessage: string = '';

  private listingService = inject(ListingService);
  private mediaService = inject(MediaService);

  // Pagination variables
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;

  pageSizeOptions = [5, 10, 20, 50];

  async ngOnInit(): Promise<void> {
    await this.loadListingsPage(this.currentPage);
  }

  async loadListingsPage(page: number): Promise<void> {
    try {
      const paginatedListings = await this.listingService.getListingsWithPagination(page, this.pageSize).toPromise();
      if (paginatedListings) {
        for (const listing of paginatedListings.content) {
          const mediaList = await this.getMediaForListing(listing.id);
          this.mediaListMap.set(listing.id, mediaList);
        }
        this.originalListings = paginatedListings.content;
        this.totalPages = paginatedListings.totalPages;
        this.filterListings();
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  }

  async getMediaForListing(listingId: string): Promise<MediaItem[]> {
    try {
      const media = await this.mediaService.findMediaByTypeAndId('listing_id', listingId).toPromise();
      return media || [];
    } catch (error) {
      console.error('Error fetching media for listing:', error);
      return [];
    }
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterListings();
  }

  filterListings(): void {
    if (this.selectedCategoriesForFiltering.length === 0 &&
        this.selectedCountiesForFiltering.length === 0 &&
        this.searchTerm.length === 0) {
      this.filteredListings = this.originalListings;
      return;
    }

    let filteredListings = this.originalListings.filter(listing =>
      (this.selectedCategoriesForFiltering.length === 0 || 
       this.selectedCategoriesForFiltering.some(category => category.name === listing.category.toString())) &&
      (this.selectedCountiesForFiltering.length === 0 || 
       this.selectedCountiesForFiltering.some(county => county.name === listing.county.toString())) &&
      (this.searchTerm.length === 0 || 
       Object.values(listing).some(value => value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())))
    );

    this.filteredListings = filteredListings;
    this.noListingsMessage = this.constructNoListingsMessage();
  }

  constructNoListingsMessage(): string {
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

    return filters.length > 0 ? `No listings found for the following filters: ${filters.join('; ')}` : '';
  }

  onSelectedCategoriesChange(categories: Category[]): void {
    this.selectedCategoriesForFiltering = categories;
    this.filterListings();
  }

  onSelectedCountiesChange(counties: County[]): void {
    this.selectedCountiesForFiltering = counties;
    this.filterListings();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadListingsPage(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page
    this.loadListingsPage(this.currentPage);
  }
}
