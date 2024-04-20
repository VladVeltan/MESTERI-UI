import { Component, OnInit, inject } from '@angular/core';
import { ListingService } from '../../servicies/listing.service';
import { NgFor, NgIf } from '@angular/common';
import { Listing } from '../../types/listing.types';
import { FilterSidebarComponent } from "../../globals/components/filter-sidebar/filter-sidebar.component";
import { ListingItemComponent } from '../../globals/components/listing-item/listing-item.component';
import { SearchBarComponent } from '../../globals/components/search-bar/search-bar.component';
import { MediaService } from '../../servicies/media.service';
import { Media } from '../../types/media.types';

@Component({
    selector: 'app-listings-page',
    standalone: true,
    templateUrl: './listings-page.component.html',
    styleUrl: './listings-page.component.scss',
    imports: [NgFor, NgIf, FilterSidebarComponent,ListingItemComponent,SearchBarComponent]
})
export class ListingsPageComponent  implements OnInit {
  listings: Listing[] = [];
  mediaListMap: Map<string, Media[]> = new Map();

  private listingService=inject(ListingService)
  private mediaService=inject(MediaService)


  ngOnInit(): void {
    this.getListingsWithMedia();
  }

  getListingsWithMedia(): void {
    this.listingService.getAllListings().subscribe(
      (listings: Listing[]) => {
        this.listings = listings;
        console.log(listings);
        // Pentru fiecare anunț, obține media corespunzătoare
        listings.forEach(listing => {
          this.getMediaForListing(listing.id);
        });
      },
      (error) => {
        console.error('Error fetching listings:', error);
      }
    );
  }
  
  getMediaForListing(listingId: string): void {
    // Obține media corespunzătoare anunțului
    this.mediaService.findMediaByTypeAndId('listing_id', listingId).subscribe(
      (mediaList: Media[]) => {
        // Stochează media într-un map folosind id-ul anunțului ca cheie
        this.mediaListMap.set(listingId, mediaList);
      },
      (error) => {
        console.error('Error fetching media for listing:', error);
      }
    );
  }
  


  onSearch(searchTerm: string): void {
    // Aici poți face ce vrei cu termenul de căutare, de exemplu, filtrarea listărilor după termenul introdus
    console.log('Search term:', searchTerm);
  }
}
