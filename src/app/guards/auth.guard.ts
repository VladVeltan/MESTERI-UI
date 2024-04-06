import { inject } from '@angular/core';
import { Router, UrlTree, CanActivateFn } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PATHS } from '../globals/routes';
import { AuthService } from '../servicies/auth.service';

export const authGuard: CanActivateFn = ():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);
    //Redirects to login route
    return authService.isLoggedIn$.pipe(
        tap(isLoggedIn => {
            if (!isLoggedIn) {
                router.navigate([PATHS.LOGIN]);
            }
        })
    );
};