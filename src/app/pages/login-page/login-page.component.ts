import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicies/auth.service';
import { PATHS } from '../../globals/routes';
import { EMAIL_VALIDATION_PATTERN, PASSWORD_VALIDATION_PATTERN } from '../../globals/validators/regex-patterns';
import { AuthData } from '../../types/auth.types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  formData!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit() {
    this.formData = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_VALIDATION_PATTERN)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(PASSWORD_VALIDATION_PATTERN)
      ])
    });
  }

  onClickSubmit(authData: AuthData): void {
    this.authService.login(authData).subscribe(
      () => {
        this.successMessage = 'Autentificare reușită!';
        this.errorMessage = null;
        this.router.navigate([PATHS.LISTINGS]);
      },
      (error) => {
        this.errorMessage = 'Email sau parolă invalidă';
        this.successMessage = null;
        console.error('Login error:', error);
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate([PATHS.REGISTER]);
  }
}
