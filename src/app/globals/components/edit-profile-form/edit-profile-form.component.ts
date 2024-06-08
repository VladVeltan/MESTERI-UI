import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { User } from '../../../types/user.types';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [FormsModule,NgClass],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.scss'
})
export class EditProfileFormComponent {
  @Input() user!: User;
  @Output() formSubmitted = new EventEmitter<User>();

  editProfileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      yearsOfExperience: [this.user.yearsOfExperience],
      age: [this.user.age, Validators.required],
      categoriesOfInterest: [this.user.categoriesOfInterest],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, Validators.required],
      password: ['', Validators.required] // Add password field
    });
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      const updatedUser = { ...this.user, ...this.editProfileForm.value };
      this.formSubmitted.emit(updatedUser);
    }
  }
}
