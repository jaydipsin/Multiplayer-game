import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Localstorage } from '../services/localstorage';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class Auth implements HttpInterceptor {
  private authService = inject(AuthService);
  localStorageservice = inject(Localstorage);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const whiteList = ['/refresh', '/auth/signup', '/auth/login'];
    if (whiteList.some((r) => req.url.includes(r))) {
      return next.handle(req);
    }

    const user = this.localStorageservice.getUser();
    if (!user || user.accessToken) return next.handle(req);
    const token = user.accessToken;
    const authReq = this.addTokenHeader(req, token);
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If it is, attempt to refresh the token
          return this.handleTokenRefresh(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handleTokenRefresh(authReq: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refesh().pipe(
      switchMap((token) => {
        this.localStorageservice.updateUser({ accessToken: token.accessToken });
        return next.handle(this.addTokenHeader(authReq, token.accessToken));
      }),
      catchError((err) => {
        // Logout thing is going to implement here
        return throwError(() => err);
      })
    );
  }

  private addTokenHeader(req: HttpRequest<any>, token: string) {
    const clone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return clone;
  }
}
