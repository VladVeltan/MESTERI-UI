import { HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { StorageKeys } from '../globals/storage-keys';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authToken = localStorage.getItem(StorageKeys.TOKEN);
  
    // Clone the request and add the authorization header
    if (authToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // Pass the cloned request with the updated header to the next handler
      return next(authReq).pipe(
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            // Handle HTTP errors
            if (err.status === 401) {
              // Specific handling for unauthorized errors         
              console.error('Unauthorized request:', err);
              // You might trigger a re-authentication flow or redirect the user here
            } else {
              // Handle other HTTP error codes
              console.error('HTTP error:', err);
            }
          } else {
            // Handle non-HTTP errors
            console.error('An error occurred:', err);
          }
  
          // Re-throw the error to propagate it further
          return throwError(() => err); 
        })
      );
    } else {
      // If there's no auth token, simply pass the original request to the next handler
      return next(req);
    }
  };