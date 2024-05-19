import { Component, EventEmitter, Output } from '@angular/core';
import { Category } from '../../../types/category.types';
import { County } from '../../../types/county.types';
import { NgFor, NgIf } from '@angular/common';
import { categories } from '../../../types/category.types';
import { counties } from '../../../types/county.types';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {

  @Output() selectedCategoriesChange: EventEmitter<Category[]> = new EventEmitter<Category[]>();
  @Output() selectedCountiesChange: EventEmitter<County[]> = new EventEmitter<County[]>();

  showCategoryDropdown: boolean = false;
  showCountyDropdown: boolean = false;


  selectedCategories: Category[] = [];
  selectedCounties: County[] = [];

  categories:Category[]=categories
  counties:County[]=counties

  toggleCategoryDropdown(): void {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    this.showCountyDropdown = false;
  }
  toggleCountyDropdown(): void {
    this.showCountyDropdown = !this.showCountyDropdown;
    this.showCategoryDropdown = false;
  }


  selectCategory(category: Category): void {

    this.showCategoryDropdown = false;
  }

  selectCounty(county: County): void {

    this.showCountyDropdown = false;
  }

  selectItem(item: Category | County, type: string): void {
    if (type === 'category') {
      const index = this.selectedCategories.findIndex(cat => cat.name === item.name);
      if (index === -1) {
        this.selectedCategories.push(item);
      } else {
        this.selectedCategories.splice(index, 1);
      }
    } else if (type === 'county') {
      const index = this.selectedCounties.findIndex(cnty => cnty.name === item.name);
      if (index === -1) {
        this.selectedCounties.push(item);
      } else {
        this.selectedCounties.splice(index, 1);
      }
    }

    if (type === 'category') {
      this.emitSelectedCategories();
    } else if (type === 'county') {
      this.emitSelectedCounties();
    }

  }

  isSelected(item: Category | County, type: string): boolean {
    if (type === 'category') {
      return this.selectedCategories.some(cat => cat.name === item.name);
    } else if (type === 'county') {
      return this.selectedCounties.some(cnty => cnty.name === item.name);
    }
    return false;
  }

  emitSelectedCategories(): void {
    this.selectedCategoriesChange.emit(this.selectedCategories);
  }

  // Method to emit changes when counties are selected/deselected
  emitSelectedCounties(): void {
    this.selectedCountiesChange.emit(this.selectedCounties);
  }
  

}
