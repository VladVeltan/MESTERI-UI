import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { StorageKeys } from '../globals/storage-keys';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
        // Check if the error is an instance of HttpErrorResponse and status is not 200
        if (err instanceof HttpErrorResponse && err.status !== 200) {
          // Handle HTTP errors
          if (err.status === 401) {
            // Specific handling for unauthorized errors
            console.error('Unauthorized request:', err);
            // You might trigger a re-authentication flow or redirect the user here
          } else {
            // Handle other HTTP error codes
            console.error('HTTP error:', err, 'error status', err.status);
          }
        } else {
          // Handle non-HTTP errors
          console.error('An error occurred:', err,err.status,err.statusText);
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
