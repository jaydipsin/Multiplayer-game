import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthAction from './auth.action';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { Localstorage } from '../../services/localstorage';

@Injectable()
export class AuthEffect {
  private action$ = inject(Actions);
  private authService = inject(AuthService);
  private localStorageService = inject(Localstorage);

  signUp$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthAction.signupAction),
      exhaustMap(({ username, email, password }) =>
        this.authService.signUp({ username, email, password }).pipe(
          map((res) => {
            console.log(res);
            return AuthAction.signupSuccessAction({ ...res });
          }),
          catchError((error) => of(AuthAction.signupFailureAction({ error: error.message })))
        )
      )
    );
  });

  logIn$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthAction.loginAction),
      exhaustMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((res) => AuthAction.loginSuccessAction({ ...res })),
          catchError((error) => of(AuthAction.loginFailureAction({ error: error.message })))
        )
      )
    );
  });

  saveAuthDataToLocalStorage$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthAction.signupSuccessAction, AuthAction.loginSuccessAction),
        tap((action) => {
          this.localStorageService.setUser({ ...action });
        })
      );
    },
    { dispatch: false }
  );
}
