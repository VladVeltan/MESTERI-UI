import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PATHS } from '../globals/routes';
import { AuthService } from '../servicies/auth.service';


export const userGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const isUser = authService.isUser$;

    if (!isUser) {
        inject(Router).createUrlTree([PATHS.LOGIN]);
        return false;
    }
    return true;
};