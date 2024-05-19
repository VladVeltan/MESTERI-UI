import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingDto } from '../../../types/listingDto.types';
import { categories } from '../../../types/category.types';
import { counties } from '../../../types/county.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent {
  formData: any = {};
  @Output() formSubmitted: EventEmitter<ListingDto> = new EventEmitter<ListingDto>();
  @Input() isProject: boolean = false; // Adaugă un input pentru a primi tipul de post
  selectedFiles: File[] = [];

  counties = counties;
  categories = categories;

  constructor() {
    this.initializeFormData();
  }

  ngOnInit(): void {}

  initializeFormData(): void {
    if (this.isProject) {
      this.formData = {
          title: '',
          description: '',
          category: '',
          county: '',
          city: '',
          status: true,
          creationDate: new Date().toISOString().slice(0, -5),
          userEmail: '',
          expectedDueDate: '',
          actionDuration: 0 // Adaugă câmpul specific pentru proiect
      };
    } else {
      this.formData = {
          title: '',
          description: '',
          category: '',
          county: '',
          city: '',
          status: true,
          creationDate: new Date().toISOString().slice(0, -5),
          userEmail: ''
      };
    }
  }

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    console.log("in form", this.formData);
    this.formData.images = this.selectedFiles; // Include the selected files in formData
    this.formSubmitted.emit(this.formData);
  }
}
