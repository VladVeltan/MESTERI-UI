import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PATHS } from '../globals/routes';
import { AuthService } from '../servicies/auth.service';


export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const isAdmin = authService.isAdmin$;

    if (!isAdmin) {
        inject(Router).createUrlTree([PATHS.LOGIN]);
        return false;
    }
    return true;
};