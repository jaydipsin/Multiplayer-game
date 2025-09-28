import { createReducer } from '@ngrx/store';
import { INITIAL_AUTH_STATE } from '../auth/state';
import { on } from '@ngrx/store';
import * as Authactions from './auth.action';

export const authState = createReducer(
  INITIAL_AUTH_STATE,
  on(Authactions.signupSuccessAction, (state, action) => {
    return {
      ...state,
      isAuthenticated: true,
      errorMessage: null,
      token: action.user.token,
    };
  }),
  on(Authactions.signupFailureAction, (state, action) => {
    return {
      ...state,
      errorMessage: action.error,
    };
  }),
  on(Authactions.loginSuccessAction, (state, action) => {
    return {
      ...state,
      isAuthenticated: true,
      errorMessage: null,
      token: action.user.token,
    };
  }),
  on(Authactions.loginFailureAction, (state, action) => {
    return {
      ...state,
      errorMessage: action.error,
    };
  })
);
