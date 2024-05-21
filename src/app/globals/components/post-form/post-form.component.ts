import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
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
  minDueDate: string = '';
  imagesTouched: boolean = false;

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
        actionDuration: 0, // Adaugă câmpul specific pentru proiect
        acceptBids: false // Setează implicit la false
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
    this.imagesTouched = true;
  }

  onAcceptBidsChange(): void {
    this.formData.actionDuration = this.formData.acceptBids ? this.formData.actionDuration : 0;
    this.updateMinDueDate();
  }

  onActionDurationChange(): void {
    if (this.formData.actionDuration < 0) {
      this.formData.actionDuration = 0;
    }
    this.updateMinDueDate();
  }

  updateMinDueDate(): void {
    const actionDuration = this.formData.actionDuration;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + actionDuration);
    this.minDueDate = currentDate.toISOString().split('T')[0]; // Only get the date part in 'YYYY-MM-DD' format
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.selectedFiles.length === 0) {
      this.imagesTouched = true;
      return;
    }

    // Asigură-te că acceptBids este setat la false dacă este null sau undefined
    if (this.isProject && (this.formData.acceptBids === null || this.formData.acceptBids === undefined)) {
      this.formData.acceptBids = false;
    }

    console.log("in form", this.formData);
    this.formData.images = this.selectedFiles; // Include the selected files in formData
    console.log("imagini selectate ", this.selectedFiles);
    console.log("imagini din form data ", this.formData.images);
    this.formSubmitted.emit(this.formData);
  }
}
