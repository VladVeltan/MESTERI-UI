import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../servicies/user.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../globals/components/search-bar/search-bar.component';
import { User } from '../../types/user.types';
import { HandymanItemComponent } from '../../globals/components/handyman-item/handyman-item.component';
import { MediaService } from '../../servicies/media.service';

@Component({
  selector: 'app-handyman-page',
  standalone: true,
  templateUrl: './handyman-page.component.html',
  styleUrls: ['./handyman-page.component.scss'],
  imports: [CommonModule, FormsModule, NgFor, NgIf, SearchBarComponent, HandymanItemComponent]
})
export class HandymanPageComponent implements OnInit {

  searchTerm: string = '';
  handyManNumber: number = 0;
  selectedSortOption: string = 'default';

  originalHandymen: User[] = [];
  filteredHandymen: User[] = [];
  noHandymenMessage: string = '';

  userService = inject(UserService);

  async ngOnInit(): Promise<void> {
    await this.loadHandymen();
  }

  async loadHandymen(): Promise<void> {
    try {
      const users = await this.userService.getAllUsers().toPromise();
      if (users) {
        this.originalHandymen = users.filter(user => user.role === 'HANDYMAN');
        this.handyManNumber = this.originalHandymen.length;
        console.log(this.originalHandymen)
        this.filterHandymen();
      }
    } catch (error) {
      console.error('Error fetching handymen:', error);
    }
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterHandymen();
  }

  onSortOptionChange(sortOption: string): void {
    this.selectedSortOption = sortOption;
    this.sortHandymen();
  }

  filterHandymen(): void {
    if (this.searchTerm.length === 0) {
      this.filteredHandymen = this.originalHandymen;
    } else {
      this.filteredHandymen = this.originalHandymen.filter(handyman =>
        Object.values(handyman).some(value => value !== null && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    this.noHandymenMessage = this.filteredHandymen.length > 0 ? '' : 'Nu s-a găsit niciun meșter după aceste criterii de căutare';
    this.sortHandymen();
  }

  sortHandymen(): void {
    if (this.selectedSortOption === 'ratingAsc') {
      this.filteredHandymen.sort((a, b) => a.rating - b.rating);
    } else if (this.selectedSortOption === 'ratingDesc') {
      this.filteredHandymen.sort((a, b) => b.rating - a.rating);
    }
  }
}
