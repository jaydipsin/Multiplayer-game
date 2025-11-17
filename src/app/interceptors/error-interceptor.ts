import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
// import { NotificationService } from './notification.service'; // Example notification service

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) // private notificationService: NotificationService
  {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        switch (err.status) {
          // --- 400: Bad Request ---
          // Often used for validation errors from the server.
          case 400:
            if (err.error?.message) {
              errorMessage = err.error.message;
            } else {
              errorMessage = 'Invalid request. Please check your input.';
            }
            // this.notificationService.showError(errorMessage);
            console.error(`Error 400: Bad Request`, err.error);
            break;

          // --- 401: Unauthorized ---
          // The user is not authenticated.
          case 401:
            errorMessage = 'Authentication failed. Please log in again.';
            console.error(`Error 401: Unauthorized`, err.error);
            this.router.navigate(['/auth']);
            break;

          // --- 403: Forbidden ---
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            // this.notificationService.showError(errorMessage);
            console.error(`Error 403: Forbidden`, err.error);
            break;

          // --- 404: Not Found ---
          case 404:
            errorMessage = 'The requested resource could not be found.';
            // this.notificationService.showError(errorMessage);
            console.error(`Error 404: Not Found`, err.error);
            // this.router.navigate(['/not-found']);
            break;

          // --- 500: Internal Server Error ---
          case 500:
            errorMessage = 'A server error occurred. Please try again later.';
            // this.notificationService.showError(errorMessage);
            console.error(`Error 500: Internal Server Error`, err.error);
            break;

          // --- 0: Network Error ---
          case 0:
            errorMessage = 'Could not connect to the server. Please check your network connection.';
            // this.notificationService.showError(errorMessage);
            console.error(`Network Error`, err);
            break;

          // --- Default Case ---
          default:
            errorMessage = `An unexpected error occurred. Status: ${err.status}`;
            // this.notificationService.showError(errorMessage);
            console.error(`Unhandled Error:`, err);
            break;
        }

        return throwError(() => err);
      })
    );
  }
}
