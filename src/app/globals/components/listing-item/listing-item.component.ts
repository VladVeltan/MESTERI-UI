import { Component,Input } from '@angular/core';
import { Listing } from '../../../types/listing.types';

@Component({
  selector: 'app-listing-item',
  standalone: true,
  imports: [],
  templateUrl: './listing-item.component.html',
  styleUrl: './listing-item.component.scss'
})
export class ListingItemComponent {
  @Input() listing!: Listing;
}
