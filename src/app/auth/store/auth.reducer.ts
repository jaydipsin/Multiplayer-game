import { createReducer } from '@ngrx/store';
import { INITIAL_AUTH_STATE } from '../auth/state';
import { on } from '@ngrx/store';
import * as Authactions from './auth.action';
import { authState, IloginResponse, IsignUpResponse } from '../model/auth.interface';
import { User } from '../../model/user.type';

export const AuthReducer = createReducer(
  INITIAL_AUTH_STATE,
  on(Authactions.signupSuccessAction, (state: authState, action: IsignUpResponse) => {
    return {
      ...state,
      errorMessage: null,
    };
  }),
  on(Authactions.signupFailureAction, (state: authState, action: { error: string }) => {
    return {
      ...state,
      errorMessage: action.error,
    };
  }),
  on(Authactions.loginSuccessAction, (state: authState, action: IloginResponse) => {
    return {
      ...state,
      isAuthenticated: true,
      errorMessage: null,
      refreshToken: action.refreshToken,
      accessToken: action.accessToken,
    };
  }),
  on(Authactions.loginFailureAction, (state: authState, action: { error: string }) => {
    return {
      ...state,
      errorMessage: action.error,
    };
  })
);
