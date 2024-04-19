import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../servicies/listing.service';
import { NgFor, NgIf } from '@angular/common';
import { Listing } from '../../types/listing.types';
import { FilterSidebarComponent } from "../../globals/components/filter-sidebar/filter-sidebar.component";
import { ListingItemComponent } from '../../globals/components/listing-item/listing-item.component';
import { SearchBarComponent } from '../../globals/components/search-bar/search-bar.component';

@Component({
    selector: 'app-listings-page',
    standalone: true,
    templateUrl: './listings-page.component.html',
    styleUrl: './listings-page.component.scss',
    imports: [NgFor, NgIf, FilterSidebarComponent,ListingItemComponent,SearchBarComponent]
})
export class ListingsPageComponent  implements OnInit {
  listings: Listing[] = [];

  constructor(private listingService: ListingService) { }

  ngOnInit(): void {
    this.getListings();
  }

  getListings(): void {
    this.listingService.getAllListings().subscribe(
      (listings: any[]) => {
        this.listings = listings;
        console.log(listings)
      },
      (error) => {
        console.error('Error fetching listings:', error);
      }
    );
  }
  onSearch(searchTerm: string): void {
    // Aici poți face ce vrei cu termenul de căutare, de exemplu, filtrarea listărilor după termenul introdus
    console.log('Search term:', searchTerm);
  }
}
