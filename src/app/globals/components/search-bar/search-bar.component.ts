import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../types/category.types';
import { County } from '../../../types/county.types';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  @Output() searchEvent = new EventEmitter<string>();

  searchTerm: string = '';

  search(): void {
    // Emite evenimentul de căutare cu termenul introdus
    this.searchEvent.emit(this.searchTerm);
  }
  
}
