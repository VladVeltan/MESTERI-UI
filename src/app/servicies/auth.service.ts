import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { AccessToken, AuthData } from '../types/auth.types';
import { environment } from '../types/environment/environment';
import { StorageKeys } from '../globals/storage-keys';
import { PATHS } from '../globals/routes';
import { ROLE_ADMIN, ROLE_USER } from '../globals/constants';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   http=inject(HttpClient);
   router=inject(Router);


   isLoggedIn$=new BehaviorSubject(false);
   isAdmin$=new BehaviorSubject(false);
   isUser$=new BehaviorSubject(false);

   userId?:string;

   private errorStatusSubject = new BehaviorSubject<number>(0);

   etErrorStatus(status: number): void {
      this.errorStatusSubject.next(status);
  }

  getErrorStatus(): Observable<number> {
      return this.errorStatusSubject.asObservable();
  }
  login(authData: AuthData): Observable<AccessToken> {
   return this.http
       .post<AccessToken>(environment.apiUrl + '/login', authData)
       .pipe(
           tap((res: AccessToken) => {
               console.log(res.token)
               localStorage.setItem(StorageKeys.TOKEN, res.token);
               this.isLoggedIn$.next(true);
               this.getUserDetails();
           })
       );
}

getUserDetails(): void {
   const token = localStorage.getItem(StorageKeys.TOKEN);
   console.log(token)
   if (token != null) {
       this.isLoggedIn$.next(true);
       const jwtData = token.split('.')[1];
       const decodedJwtJsonData = window.atob(jwtData);
       const decodedJwtData = JSON.parse(decodedJwtJsonData);
       const expirationTime = decodedJwtData.exp * 1000;
       const currentTime = new Date().getTime();
       const expirationDuration = expirationTime - currentTime;
       this.autoLogout(expirationDuration);

       switch (decodedJwtData.authorities) {
           case ROLE_ADMIN: {
               this.isAdmin$.next(true);
               this.router.navigate([PATHS.LISTINGS]);
               break;
           }
           case ROLE_USER: {
               this.isUser$.next(true);
               this.router.navigate([
                   PATHS.LISTINGS + '/' + decodedJwtData.userId
               ]);
               break;
           }
       }
       this.userId = decodedJwtData.userId;
   } else {
       localStorage.removeItem(StorageKeys.TOKEN);
       this.userId = undefined;

       this.isLoggedIn$.next(false);
       this.isAdmin$.next(false);
       this.isUser$.next(false);
   }
}

    logout(): void {
        localStorage.removeItem(StorageKeys.TOKEN);

        this.userId = undefined;
        this.isLoggedIn$.next(false);
        this.isAdmin$.next(false);
        this.isUser$.next(false);

        this.router.navigate([PATHS.LOGIN]);
    }

    private autoLogout(expirationDuration: number): void {
        setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
}