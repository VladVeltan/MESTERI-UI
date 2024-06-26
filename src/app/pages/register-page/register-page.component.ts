import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicies/auth.service';
import { PATHS } from '../../globals/routes';
import { NgIf, NgFor } from '@angular/common';
import { MaterialModule } from '../../globals/modules/material.module';
import { categoryImages } from '../../types/categoryImages.types';
import { categories } from '../../types/category.types';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, MaterialModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  formData!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isMester: boolean = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  categories = categories.map(category => category.name);
  selectedCategories: string[] = [];
  categoryImages = categoryImages; // Add this line to make categoryImages available in the template

  ngOnInit() {
    this.formData = this.formBuilder.group({
      role: new FormControl('USER'),
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmEmail: new FormControl('', [Validators.required, this.emailMatchValidator]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#@$!%*?&])[A-Za-z\\d@#$!%*?&]{8,}$')
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      yearsOfExperience: new FormControl(''),
      age: new FormControl('', [Validators.min(18)]),
      creationDate: new Date().toISOString().slice(0, -5),
      rating: 0,
      categoriesOfInterest: new FormControl(''),
    });

    this.onRoleChange();
    this.formData.get('role')?.valueChanges.subscribe(() => this.onRoleChange());
  }

  onRoleChange() {
    const role = this.formData.get('role')?.value;
    this.isMester = role === 'HANDYMAN';
    const experienceControl = this.formData.get('yearsOfExperience');
    const ageControl = this.formData.get('age');

    if (this.isMester) {
      experienceControl?.setValidators([Validators.required, Validators.min(1)]);
      ageControl?.setValidators([Validators.required, Validators.min(18)]);
    } else {
      experienceControl?.clearValidators();
      ageControl?.clearValidators();
    }

    experienceControl?.updateValueAndValidity();
    ageControl?.updateValueAndValidity();
  }

  emailMatchValidator = (control: FormControl): { [key: string]: boolean } | null => {
    if (this.formData) {
      return control.value === this.formData.get('email')?.value ? null : { emailMismatch: true };
    }
    return null;
  };

  passwordMatchValidator = (control: FormControl): { [key: string]: boolean } | null => {
    if (this.formData) {
      return control.value === this.formData.get('password')?.value ? null : { passwordMismatch: true };
    }
    return null;
  };

  onClickSubmit(): void {
    if (this.formData.invalid) {
      this.errorMessage = 'Vă rugăm să corectați erorile din formular.';
      return;
    }

    if (this.isMester) {
      this.formData.patchValue({
        categoriesOfInterest: this.selectedCategories.join(',')
      });
    }

    this.authService.register(this.formData.value).subscribe(
      () => {
        this.successMessage = 'Înregistrare reușită!';
        this.errorMessage = null;
        this.router.navigate([PATHS.LISTINGS]);
      },
      (error) => {
        this.errorMessage = 'A apărut o eroare la înregistrare';
        this.successMessage = null;
        console.error('Register error:', error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  navigateToLogin(): void {
    this.router.navigate([PATHS.LOGIN]);
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
}
