import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PATHS } from '../globals/routes';
import { AuthService } from '../servicies/auth.service';


export const candidateGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const isCandidate = authService.isUser$;

    if (!isCandidate) {
        inject(Router).createUrlTree([PATHS.LOGIN]);
        return false;
    }
    return true;
};