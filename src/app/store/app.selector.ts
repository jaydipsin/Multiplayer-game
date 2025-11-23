import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../model/state.interface';
import { authState } from '../auth/model/auth.interface';

export const selectedAuth = createFeatureSelector<authState>('auth');

export const user = createSelector(selectedAuth, (state) => {
  console.log(state);

  return state.user;
});
