import { Component, OnInit, inject } from '@angular/core';

import { FormGroup,ReactiveFormsModule , FormControl, Validators, FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../servicies/auth.service';
import { PATHS } from '../../globals/routes';
import { EMAIL_VALIDATION_PATTERN, PASSWORD_VALIDATION_PATTERN } from '../../globals/validators/regex-patterns';
import { AuthData } from '../../types/auth.types';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  authService=inject(AuthService)
  router=inject(Router)
  formBuilder=inject(FormBuilder)

  formData!: FormGroup;
  errorStatus!: number;
  

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

  onClickSubmit(authData: AuthData):void {
     

     console.log("Login page: " + authData.email);
     console.log("Login page: " + authData.password);

     this.authService.login(authData).subscribe();
  }
}
