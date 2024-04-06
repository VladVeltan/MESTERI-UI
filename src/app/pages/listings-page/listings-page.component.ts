import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../servicies/listing.service';
import { NgFor, NgIf } from '@angular/common';
import { Listing } from '../../types/listing.types';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './listings-page.component.html',
  styleUrl: './listings-page.component.scss'
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
}
