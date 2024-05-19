import { Component, OnInit, inject } from '@angular/core';
import { ListingService } from '../../servicies/listing.service';
import { NgFor, NgIf } from '@angular/common';
import { Listing } from '../../types/listing.types';
import { FilterSidebarComponent } from "../../globals/components/filter-sidebar/filter-sidebar.component";
import { ListingItemComponent } from '../../globals/components/listing-item/listing-item.component';
import { SearchBarComponent } from '../../globals/components/search-bar/search-bar.component';
import { MediaService } from '../../servicies/media.service';
import { MediaItem } from '../../types/media.types';
import { Category } from '../../types/category.types';
import { County } from '../../types/county.types';
import { ListingDto } from '../../types/listingDto.types';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  templateUrl: './listings-page.component.html',
  styleUrl: './listings-page.component.scss',
  imports: [NgFor, NgIf, FilterSidebarComponent, ListingItemComponent, SearchBarComponent]
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

  async ngOnInit(): Promise<void> {
    await this.getListingsWithMedia();
    console.log(this.mediaListMap);
    this.filterListings(); // Initialize filtered listings
  }

  async getListingsWithMedia(): Promise<void> {
    try {
      const listings = await this.listingService.getAllListings().toPromise();
      if (listings) {
        for (const listing of listings) {
          const mediaList = await this.getMediaForListing(listing.id);
          this.mediaListMap.set(listing.id, mediaList);
        }
        this.originalListings = listings;
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  }

  async getMediaForListing(listingId: string): Promise<MediaItem[]> {
    try {
      const media = await this.mediaService.findMediaByTypeAndId('listing_id', listingId).toPromise();
      return media || []; // Folosim operatorul ternar pentru a trata cazul în care media este undefined
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
    // If no filters are applied, display the original listings
    if (this.selectedCategoriesForFiltering.length === 0 &&
        this.selectedCountiesForFiltering.length === 0 &&
        this.searchTerm.length === 0) {
      this.filteredListings = this.originalListings;
      return;
    }

    // Filter listings based on category, county, and search term
    let filteredListings = this.originalListings.filter(listing =>
      (this.selectedCategoriesForFiltering.length === 0 || 
       this.selectedCategoriesForFiltering.some(category => category.name === listing.category.toString())) &&
      (this.selectedCountiesForFiltering.length === 0 || 
       this.selectedCountiesForFiltering.some(county => county.name === listing.county.toString())) &&
      (this.searchTerm.length === 0 || 
       Object.values(listing).some(value => value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())))
    );

    // Update the filtered listings
    this.filteredListings = filteredListings;

    // Construct the message for no listings found
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

  // Method to handle changes in selected categories
  onSelectedCategoriesChange(categories: Category[]): void {
    this.selectedCategoriesForFiltering = categories;
    this.filterListings();
  }

  // Method to handle changes in selected counties
  onSelectedCountiesChange(counties: County[]): void {
    this.selectedCountiesForFiltering = counties;
    this.filterListings();
  }
}
