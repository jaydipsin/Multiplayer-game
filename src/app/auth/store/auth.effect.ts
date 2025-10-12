import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthAction from './auth.action';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

@Injectable()
export class AuthEffect {
  constructor(private authService: AuthService) {}
  private action$ = inject(Actions);

  signUp$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthAction.signupAction),
      exhaustMap(({ username, email, password }) =>
        this.authService.signUp({ username, email, password }).pipe(
          map((res) => AuthAction.signupSuccessAction({ ...res })),
          catchError((error) => of(AuthAction.signupFailureAction({ error: error.message })))
        )
      )
    );
  });

    // Might used in future
  // signUpSuccess = createEffect(() => {
  //   return this.action$.pipe(
  //     ofType(AuthAction.signupSuccessAction),
  //     tap((action) => {

  //     })
  //   )
  // }, { dispatch: false });
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
}
