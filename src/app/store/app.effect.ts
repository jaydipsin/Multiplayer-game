import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AppActions from './app.action';
import * as AuthActions from '../auth/store/auth.action';
import { of, switchMap, tap } from 'rxjs';
import { IloginResponse } from '../auth/model/auth.interface';
import { Localstorage } from '../services/localstorage';

@Injectable({ providedIn: 'root' })
export class AppEffect {
  private action$ = inject(Actions);
  private localStorageService = inject(Localstorage);

  autoLogin$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.autoLogin),
      switchMap(() => {
        const loginPayload = this.localStorageService.getUser();
        if (loginPayload?.accessToken) {
          return of(AuthActions.loginSuccessAction(loginPayload as IloginResponse));
        }
        return of(AuthActions.logoutAction());
      })
    );
  });
}
