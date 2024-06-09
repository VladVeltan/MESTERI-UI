import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../types/user.types';
import { categoryImages } from '../../../types/categoryImages.types';
import { categories } from '../../../types/category.types';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss']
})
export class EditProfileFormComponent implements OnInit {
  @Input() user!: User;
  @Output() formSubmitted = new EventEmitter<User>();
  @Output() closeForm = new EventEmitter<void>(); // Add an output event for closing the form

  editProfileForm!: FormGroup;
  categories = categories.map(category => category.name);
  selectedCategories: string[] = [];
  categoryImages = categoryImages;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      id: [this.user.id, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: [this.user.phone, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      yearsOfExperience: [this.user.yearsOfExperience],
      age: [this.user.age],
      categoriesOfInterest: [this.user.categoriesOfInterest],
      description: [this.user.description],
      role: [this.user.role, Validators.required],
      creationDate: [this.user.creationDate],
      rating: [this.user.rating],
    });

    this.selectedCategories = this.user.categoriesOfInterest.split(',').map(category => category.trim());
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedUser = {
        ...this.editProfileForm.value,
        categoriesOfInterest: this.selectedCategories.join(',')
      };
      console.log(updatedUser)
      this.formSubmitted.emit(updatedUser);
    }
  }

  toggleCategorySelection(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  closeFormAction(): void {
    this.closeForm.emit();
  }
}
