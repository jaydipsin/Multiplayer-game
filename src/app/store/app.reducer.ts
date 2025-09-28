import { createReducer } from '@ngrx/store';
import { AppState } from '../model/state.interface';
import { on } from '@ngrx/store';
import * as AppActions from './app.action';

export const INITIAL_APP_STATE: AppState = {
  auth: null,
  user: null,
};

export const AppReducer = createReducer(
  INITIAL_APP_STATE,
  on(AppActions.setUserAction, (state, action) => {
    return {
      ...state,
      user: action.user,
    };
  })
);
