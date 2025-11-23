import { ActionReducerMap, createReducer } from '@ngrx/store';
import { AppState } from '../model/state.interface';
import { on } from '@ngrx/store';
import * as AppActions from './app.action';
import { User } from '../model/user.type';
import { AuthReducer } from '../auth/store/auth.reducer';
import { authState } from '../auth/model/auth.interface';

export const reducers: ActionReducerMap<AppState> = {
  auth: AuthReducer,
};
