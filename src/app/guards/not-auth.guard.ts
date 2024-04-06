import { UrlTree, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageKeys } from '../globals/storage-keys';


export const notAuthGuard: CanActivateFn = ():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
    if (!localStorage.getItem(StorageKeys.TOKEN)) {
        return true;
    }
    return false;
};
