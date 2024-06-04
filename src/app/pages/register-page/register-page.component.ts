import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicies/auth.service';
import { PATHS } from '../../globals/routes';
import { NgIf } from '@angular/common';
import { MaterialModule } from '../../globals/modules/material.module';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MaterialModule],
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
      experience: new FormControl(''),
      age: new FormControl('', [Validators.min(18)]),
      creationDate: new Date().toISOString().slice(0, -5),
      rating:0
    });
    
    this.onRoleChange();
    this.formData.get('role')?.valueChanges.subscribe(() => this.onRoleChange());
  }

  onRoleChange() {
    const role = this.formData.get('role')?.value;
    this.isMester = role === 'HANDYMAN';
    const experienceControl = this.formData.get('experience');
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
    console.log(this.formData.value,"in clickSumbit")
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
}
